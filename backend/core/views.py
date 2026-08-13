from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import (
    UserProfile, Course, Skill, Lesson, Exercise,
    UserSkillProgress, UserLessonProgress, DailyProgress
)
from .serializers import (
    HealthCheckSerializer, UserDetailSerializer, CourseHierarchySerializer,
    LessonPublicSerializer, LeaderboardEntrySerializer, AnswerSubmissionSerializer
)
from .utils import get_default_learner, get_default_learner_profile
from .services.lesson_service import process_answer_submission
from .services.gamification_service import complete_lesson_for_user


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint returning system status.
    """
    data = {
        "status": "ok",
        "message": "Duolingo Clone API is running"
    }
    serializer = HealthCheckSerializer(data)
    return Response(serializer.data, status=status.HTTP_200_OK)


class UserDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_default_learner_profile(request)
        if not profile:
            return Response(
                {"detail": "Learner profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = UserDetailSerializer(profile)
        data = serializer.data

        # Attach today's daily XP
        today = timezone.now().date()
        daily_prog = DailyProgress.objects.filter(user=profile.user, date=today).first()
        daily_xp = daily_prog.xp_earned if daily_prog else 0
        data['daily_xp'] = daily_xp
        data['daily_goal_progress'] = min(100, int((daily_xp / profile.daily_xp_goal) * 100))

        return Response(data, status=status.HTTP_200_OK)


class CourseDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        learner = get_default_learner()
        course = Course.objects.prefetch_related('units__skills__lessons').first()
        if not course:
            return Response(
                {"detail": "No course found."},
                status=status.HTTP_404_NOT_FOUND
            )

        skill_progress_map = {}
        lesson_progress_map = {}

        if learner:
            sp_qs = UserSkillProgress.objects.filter(user=learner)
            skill_progress_map = {sp.skill_id: sp for sp in sp_qs}

            lp_qs = UserLessonProgress.objects.filter(user=learner)
            lesson_progress_map = {lp.lesson_id: lp for lp in lp_qs}

        context = {
            'skill_progress_map': skill_progress_map,
            'lesson_progress_map': lesson_progress_map
        }
        serializer = CourseHierarchySerializer(course, context=context)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserProgressView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        learner = get_default_learner(request)
        profile = get_default_learner_profile(request)
        if not learner or not profile:
            return Response(
                {"detail": "Learner not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        today = timezone.now().date()
        daily_prog = DailyProgress.objects.filter(user=learner, date=today).first()
        daily_xp = daily_prog.xp_earned if daily_prog else 0

        skill_progress_qs = UserSkillProgress.objects.filter(user=learner)
        sp_map = {sp.skill_id: sp for sp in skill_progress_qs}

        all_skills = Skill.objects.select_related('unit').order_by('unit__order', 'order')

        completed_skills = sum(1 for sp in sp_map.values() if sp.completed)
        total_skills = len(all_skills)

        lp_qs = UserLessonProgress.objects.filter(user=learner)
        completed_lessons = lp_qs.filter(completed=True).count()
        total_lessons = Lesson.objects.count()

        skills_progress_list = []
        found_in_progress = False

        for skill in all_skills:
            sp = sp_map.get(skill.id)
            is_completed = sp.completed if sp else False
            prog_pct = sp.progress if sp else 0
            crowns = sp.crowns if sp else 0

            if is_completed:
                status_str = 'completed'
            elif prog_pct > 0 or not found_in_progress:
                status_str = 'in_progress'
                found_in_progress = True
            else:
                status_str = 'locked'

            skills_progress_list.append({
                'skill_id': skill.id,
                'title': skill.title,
                'unit_title': skill.unit.title,
                'progress': prog_pct,
                'completed': is_completed,
                'crowns': crowns,
                'status': status_str
            })

        response_data = {
            'user': {
                'username': learner.username,
                'xp': profile.xp,
                'streak': profile.streak,
                'hearts': profile.hearts,
                'gems': profile.gems,
                'daily_goal': profile.daily_xp_goal,
                'daily_xp': daily_xp,
                'daily_goal_progress': min(100, int((daily_xp / profile.daily_xp_goal) * 100))
            },
            'stats': {
                'completed_skills': completed_skills,
                'total_skills': total_skills,
                'completed_lessons': completed_lessons,
                'total_lessons': total_lessons
            },
            'skills_progress': skills_progress_list
        }

        return Response(response_data, status=status.HTTP_200_OK)


class LessonDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, lesson_id):
        try:
            lesson = Lesson.objects.prefetch_related('exercises').get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response(
                {"detail": f"Lesson with ID {lesson_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = LessonPublicSerializer(lesson)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AnswerSubmissionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, lesson_id):
        serializer = AnswerSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        exercise_id = serializer.validated_data['exercise_id']
        submitted_answer = serializer.validated_data['answer']

        learner = get_default_learner(request)
        profile = get_default_learner_profile(request)

        if not learner or not profile:
            return Response({"detail": "Learner not found."}, status=status.HTTP_404_NOT_FOUND)

        if profile.hearts <= 0:
            return Response({"detail": "You are out of hearts."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"detail": f"Lesson {lesson_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            exercise = Exercise.objects.get(id=exercise_id, lesson=lesson)
        except Exercise.DoesNotExist:
            return Response({"detail": f"Exercise {exercise_id} not found for lesson {lesson_id}."}, status=status.HTTP_400_BAD_REQUEST)

        result = process_answer_submission(learner, lesson, exercise, submitted_answer)
        return Response(result, status=status.HTTP_200_OK)


class LessonCompletionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, lesson_id):
        learner = get_default_learner(request)
        if not learner:
            return Response({"detail": "Learner not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"detail": f"Lesson {lesson_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        result = complete_lesson_for_user(learner, lesson)
        return Response(result, status=status.HTTP_200_OK)


class HeartRefillView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile = get_default_learner_profile(request)
        if not profile:
            return Response({"detail": "Learner profile not found."}, status=status.HTTP_404_NOT_FOUND)

        profile.hearts = 5
        profile.save()
        return Response({"hearts": 5, "message": "Hearts refilled successfully."}, status=status.HTTP_200_OK)


class AchievementView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        learner = get_default_learner(request)
        if not learner:
            return Response({"detail": "Learner not found."}, status=status.HTTP_404_NOT_FOUND)

        from .services.achievement_service import get_user_achievements
        achievements = get_user_achievements(learner)
        return Response({"achievements": achievements}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        learner = get_default_learner(request)
        profile = get_default_learner_profile(request)
        if not learner or not profile:
            return Response({"detail": "Learner not found."}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        daily_prog = DailyProgress.objects.filter(user=learner, date=today).first()
        daily_xp = daily_prog.xp_earned if daily_prog else 0

        sp_qs = UserSkillProgress.objects.filter(user=learner)
        completed_skills = sum(1 for sp in sp_qs if sp.completed)
        total_skills = Skill.objects.count()

        completed_lessons = UserLessonProgress.objects.filter(user=learner, completed=True).count()
        total_lessons = Lesson.objects.count()

        from .services.achievement_service import get_user_achievements
        achievements = get_user_achievements(learner)

        name = f"{learner.first_name} {learner.last_name}".strip() or "Spanish Learner"

        return Response({
            "user": {
                "id": learner.id,
                "username": learner.username,
                "name": name,
                "xp": profile.xp,
                "streak": profile.streak,
                "hearts": profile.hearts,
                "gems": profile.gems,
                "daily_goal": profile.daily_xp_goal,
                "daily_xp": daily_xp,
                "daily_goal_progress": min(100, int((daily_xp / profile.daily_xp_goal) * 100))
            },
            "stats": {
                "completed_skills": completed_skills,
                "total_skills": total_skills,
                "completed_lessons": completed_lessons,
                "total_lessons": total_lessons
            },
            "achievements": achievements
        }, status=status.HTTP_200_OK)


class LeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profiles = list(UserProfile.objects.select_related('user').order_by('-xp', '-streak'))
        for index, prof in enumerate(profiles, start=1):
            prof.rank = index

        serializer = LeaderboardEntrySerializer(profiles, many=True)
        return Response({'leaderboard': serializer.data}, status=status.HTTP_200_OK)


class AIHintView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        exercise_id = request.data.get('exercise_id')
        user_answer = request.data.get('user_answer', '')

        if not exercise_id:
            return Response({"detail": "exercise_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response({"detail": f"Exercise {exercise_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        from .services.gemini_service import gemini_service
        hint = gemini_service.generate_hint(
            question=exercise.question,
            exercise_type=exercise.exercise_type,
            user_answer=user_answer
        )
        return Response({"hint": hint}, status=status.HTTP_200_OK)


class AIExplainView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        exercise_id = request.data.get('exercise_id')
        user_answer = request.data.get('user_answer', '')

        if not exercise_id or not user_answer:
            return Response({"detail": "exercise_id and user_answer are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response({"detail": f"Exercise {exercise_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        from .services.gemini_service import gemini_service
        explanation = gemini_service.explain_mistake(
            question=exercise.question,
            user_answer=user_answer,
            correct_answer=exercise.correct_answer
        )
        return Response({"explanation": explanation}, status=status.HTTP_200_OK)


class AITutorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        message = request.data.get('message', '').strip()
        if not message:
            return Response({"detail": "message is required."}, status=status.HTTP_400_BAD_REQUEST)

        from .services.gemini_service import gemini_service
        answer = gemini_service.ask_tutor(message)
        return Response({"answer": answer}, status=status.HTTP_200_OK)


class AIWordExplainView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        word = request.data.get('word', '').strip()
        if not word:
            return Response({"detail": "word is required."}, status=status.HTTP_400_BAD_REQUEST)

        from .services.gemini_service import gemini_service
        explanation = gemini_service.explain_word(word)
        return Response(explanation, status=status.HTTP_200_OK)


class AILessonSummaryView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        if not lesson_id:
            return Response({"detail": "lesson_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lesson = Lesson.objects.prefetch_related('exercises').get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"detail": f"Lesson {lesson_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        questions = [e.question for e in lesson.exercises.all()]
        from .services.gemini_service import gemini_service
        summary = gemini_service.summarize_lesson(lesson.title, questions)
        return Response({"summary": summary}, status=status.HTTP_200_OK)


from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()

        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username is already taken."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        profile = UserProfile.objects.create(
            user=user,
            xp=0,
            streak=1,
            hearts=5,
            gems=100,
            daily_xp_goal=50
        )

        skills = list(Skill.objects.order_by('unit__order', 'order'))
        for index, skill in enumerate(skills):
            UserSkillProgress.objects.create(
                user=user,
                skill=skill,
                progress=0,
                completed=False,
                crowns=0
            )

        login(request, user)

        name = f"{user.first_name} {user.last_name}".strip() or user.username
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "name": name,
                "xp": profile.xp,
                "streak": profile.streak,
                "hearts": profile.hearts,
                "gems": profile.gems,
                "daily_goal": profile.daily_xp_goal
            },
            "message": "Registration successful"
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({"detail": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)
        profile = UserProfile.objects.filter(user=user).first()
        if not profile:
            profile = UserProfile.objects.create(user=user, xp=0, streak=1, hearts=5, gems=100)

        name = f"{user.first_name} {user.last_name}".strip() or user.username
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "name": name,
                "xp": profile.xp,
                "streak": profile.streak,
                "hearts": profile.hearts,
                "gems": profile.gems,
                "daily_goal": profile.daily_xp_goal
            },
            "message": "Login successful"
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


