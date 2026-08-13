from datetime import date, timedelta
from django.test import TestCase
from django.contrib.auth.models import User
from core.models import (
    UserProfile, Course, Unit, Skill, Lesson, Exercise,
    UserSkillProgress, UserLessonProgress, DailyProgress
)
from core.services.lesson_service import validate_exercise_answer, process_answer_submission
from core.services.gamification_service import calculate_new_streak, complete_lesson_for_user


class AnswerValidationTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testlearner')
        self.profile = UserProfile.objects.create(user=self.user, xp=0, streak=1, hearts=5)
        self.course = Course.objects.create(name='Spanish', language='Spanish', description='Spanish')
        self.unit = Unit.objects.create(course=self.course, title='Unit 1', order=1)
        self.skill = Skill.objects.create(unit=self.unit, title='Greetings', order=1)
        self.lesson = Lesson.objects.create(skill=self.skill, title='Greetings 1', order=1, xp_reward=20)

    def test_multiple_choice_validation(self):
        ex = Exercise.objects.create(
            lesson=self.lesson,
            exercise_type=Exercise.ExerciseType.MULTIPLE_CHOICE,
            question='What does "Hola" mean?',
            correct_answer='Hello',
            options=['Hello', 'Goodbye', 'Please'],
            order=1
        )
        is_cor, msg, ans = validate_exercise_answer(ex, 'Hello')
        self.assertTrue(is_cor)

        is_cor2, _, _ = validate_exercise_answer(ex, '  hello  ')
        self.assertTrue(is_cor2)

        is_cor3, _, _ = validate_exercise_answer(ex, 'Goodbye')
        self.assertFalse(is_cor3)

    def test_type_answer_validation(self):
        ex = Exercise.objects.create(
            lesson=self.lesson,
            exercise_type=Exercise.ExerciseType.TYPE_ANSWER,
            question='Translate "Goodbye"',
            correct_answer='adiós',
            order=2
        )
        is_cor, _, _ = validate_exercise_answer(ex, 'Adiós')
        self.assertTrue(is_cor)

        is_cor2, _, _ = validate_exercise_answer(ex, '  ADIÓS!  ')
        self.assertTrue(is_cor2)

    def test_match_pairs_validation(self):
        ex = Exercise.objects.create(
            lesson=self.lesson,
            exercise_type=Exercise.ExerciseType.MATCH_PAIRS,
            question='Match pairs',
            correct_answer='Hola:Hello, Gracias:Thank you',
            order=3
        )
        is_cor, _, _ = validate_exercise_answer(ex, 'Hola:Hello, Gracias:Thank you')
        self.assertTrue(is_cor)


class HeartsSystemTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testlearner')
        self.profile = UserProfile.objects.create(user=self.user, xp=0, streak=1, hearts=2)
        self.course = Course.objects.create(name='Spanish', language='Spanish', description='Spanish')
        self.unit = Unit.objects.create(course=self.course, title='Unit 1', order=1)
        self.skill = Skill.objects.create(unit=self.unit, title='Greetings', order=1)
        self.lesson = Lesson.objects.create(skill=self.skill, title='Greetings 1', order=1, xp_reward=20)
        self.exercise = Exercise.objects.create(
            lesson=self.lesson,
            exercise_type=Exercise.ExerciseType.MULTIPLE_CHOICE,
            question='What does "Hola" mean?',
            correct_answer='Hello',
            options=['Hello', 'Goodbye'],
            order=1
        )

    def test_wrong_answer_deducts_heart(self):
        res = process_answer_submission(self.user, self.lesson, self.exercise, 'Goodbye')
        self.assertFalse(res['correct'])
        self.assertEqual(res['hearts_remaining'], 1)

    def test_zero_hearts_prevents_submission(self):
        self.profile.hearts = 0
        self.profile.save()

        res = process_answer_submission(self.user, self.lesson, self.exercise, 'Hello')
        self.assertFalse(res['correct'])
        self.assertTrue(res['lesson_failed'])


class StreakSystemTestCase(TestCase):
    def test_first_activity(self):
        today = date(2026, 8, 13)
        res = calculate_new_streak(0, None, today)
        self.assertEqual(res, 1)

    def test_same_day_activity(self):
        today = date(2026, 8, 13)
        res = calculate_new_streak(3, today, today)
        self.assertEqual(res, 3)

    def test_consecutive_day_activity(self):
        today = date(2026, 8, 13)
        yesterday = date(2026, 8, 12)
        res = calculate_new_streak(3, yesterday, today)
        self.assertEqual(res, 4)

    def test_missed_day_activity(self):
        today = date(2026, 8, 13)
        two_days_ago = date(2026, 8, 11)
        res = calculate_new_streak(5, two_days_ago, today)
        self.assertEqual(res, 1)


class LessonCompletionTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testlearner')
        self.profile = UserProfile.objects.create(user=self.user, xp=100, streak=1, hearts=5)
        self.course = Course.objects.create(name='Spanish', language='Spanish', description='Spanish')
        self.unit = Unit.objects.create(course=self.course, title='Unit 1', order=1)
        self.skill = Skill.objects.create(unit=self.unit, title='Greetings', order=1)
        self.skill2 = Skill.objects.create(unit=self.unit, title='Common Words', order=2)
        self.lesson = Lesson.objects.create(skill=self.skill, title='Greetings 1', order=1, xp_reward=20)
        self.exercise = Exercise.objects.create(
            lesson=self.lesson,
            exercise_type=Exercise.ExerciseType.MULTIPLE_CHOICE,
            question='What does "Hola" mean?',
            correct_answer='Hello',
            order=1
        )

    def test_perfect_lesson_completion(self):
        # Submit correct answer
        process_answer_submission(self.user, self.lesson, self.exercise, 'Hello')

        # Complete lesson
        res = complete_lesson_for_user(self.user, self.lesson)

        self.assertTrue(res['lesson_completed'])
        self.assertTrue(res['perfect'])
        self.assertEqual(res['xp_earned'], 30) # 20 base + 10 bonus
        self.assertEqual(res['total_xp'], 130)

    def test_repeat_completion_prevents_xp_duplication(self):
        process_answer_submission(self.user, self.lesson, self.exercise, 'Hello')
        complete_lesson_for_user(self.user, self.lesson)

        # Second call to completion
        res2 = complete_lesson_for_user(self.user, self.lesson)
        self.assertTrue(res2['already_completed'])
        self.assertEqual(res2['xp_earned'], 0)
        self.assertEqual(res2['total_xp'], 130)


class AchievementTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='learner')
        self.profile = UserProfile.objects.create(user=self.user, xp=150, streak=3, hearts=5)

    def test_achievements_calculation(self):
        from core.services.achievement_service import get_user_achievements
        achievements = get_user_achievements(self.user)
        self.assertEqual(len(achievements), 4)

        # Streak >= 3 & XP >= 100 should be unlocked
        streak_ach = next(a for a in achievements if a['id'] == 'three_day_streak')
        self.assertTrue(streak_ach['unlocked'])

        xp_ach = next(a for a in achievements if a['id'] == 'hundred_xp')
        self.assertTrue(xp_ach['unlocked'])


class ProfileApiTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='learner')
        self.profile = UserProfile.objects.create(user=self.user, xp=120, streak=3, hearts=5)

    def test_profile_api_endpoint(self):
        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('user', response.data)
        self.assertIn('stats', response.data)
        self.assertIn('achievements', response.data)
        self.assertEqual(response.data['user']['xp'], 120)


from unittest.mock import patch

class GeminiAiApiTestCase(TestCase):
    def setUp(self):
        self.course = Course.objects.create(name='Spanish', language='Spanish')
        self.unit = Unit.objects.create(course=self.course, title='Unit 1', order=1)
        self.skill = Skill.objects.create(unit=self.unit, title='Basics', order=1)
        self.lesson = Lesson.objects.create(skill=self.skill, title='Greetings 1', order=1)
        self.exercise = Exercise.objects.create(
            lesson=self.lesson,
            exercise_type='multiple_choice',
            question='Translate "Hello"',
            correct_answer='Hola',
            options=['Hola', 'Adiós', 'Gracias']
        )

    @patch('core.services.gemini_service.gemini_service.generate_hint')
    def test_ai_hint_endpoint(self, mock_hint):
        mock_hint.return_value = "Think of a common greeting."
        response = self.client.post('/api/ai/hint/', {
            'exercise_id': self.exercise.id,
            'user_answer': 'Adiós'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('hint', response.data)
        self.assertEqual(response.data['hint'], "Think of a common greeting.")

    @patch('core.services.gemini_service.gemini_service.explain_mistake')
    def test_ai_explain_endpoint(self, mock_explain):
        mock_explain.return_value = "Hola means hello, while Adiós means goodbye."
        response = self.client.post('/api/ai/explain/', {
            'exercise_id': self.exercise.id,
            'user_answer': 'Adiós'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('explanation', response.data)
        self.assertEqual(response.data['explanation'], "Hola means hello, while Adiós means goodbye.")

    @patch('core.services.gemini_service.gemini_service.ask_tutor')
    def test_ai_tutor_endpoint(self, mock_tutor):
        mock_tutor.return_value = "Hola is Spanish for Hello!"
        response = self.client.post('/api/ai/tutor/', {
            'message': 'What does Hola mean?'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('answer', response.data)
        self.assertEqual(response.data['answer'], "Hola is Spanish for Hello!")


class UserAuthenticationApiTestCase(TestCase):
    def test_user_registration_login_logout_flow(self):
        # 1. Register
        reg_response = self.client.post('/api/auth/register/', {
            'username': 'newlearner',
            'password': 'secretpassword123',
            'first_name': 'New',
            'last_name': 'Learner',
            'email': 'new@example.com'
        }, format='json')
        self.assertEqual(reg_response.status_code, 201)
        self.assertEqual(reg_response.data['user']['username'], 'newlearner')

        # 2. Login
        login_response = self.client.post('/api/auth/login/', {
            'username': 'newlearner',
            'password': 'secretpassword123'
        }, format='json')
        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.data['user']['username'], 'newlearner')

        # 3. Logout
        logout_response = self.client.post('/api/auth/logout/')
        self.assertEqual(logout_response.status_code, 200)



