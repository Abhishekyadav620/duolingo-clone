from datetime import date, timedelta
from django.db import transaction
from django.utils import timezone
from core.models import (
    UserProfile, Skill, Lesson, UserSkillProgress,
    UserLessonProgress, DailyProgress, UserExerciseSubmission
)


def calculate_new_streak(current_streak: int, last_active_date: date | None, current_date: date) -> int:
    """
    Calculates the updated streak based on last active date and current date.
    - Same day: streak remains unchanged.
    - Consecutive day (1 day after last_active_date): streak + 1.
    - Missed day (more than 1 day after last_active_date or None): streak resets to 1.
    """
    if last_active_date is None:
        return 1

    if last_active_date == current_date:
        return max(1, current_streak)

    if last_active_date == current_date - timedelta(days=1):
        return current_streak + 1

    # More than 1 day missed
    return 1


@transaction.atomic
def complete_lesson_for_user(user, lesson: Lesson) -> dict:
    """
    Atomically completes a lesson for a user, updating UserProfile, XP,
    DailyProgress, UserLessonProgress, UserSkillProgress, streak, and skill unlocking.
    Prevents duplicate XP inflation if completed multiple times.
    """
    current_date = timezone.now().date()
    profile = UserProfile.objects.select_for_update().get(user=user)

    # Check if lesson was already completed
    lesson_progress, _ = UserLessonProgress.objects.get_or_create(
        user=user,
        lesson=lesson,
        defaults={'completed': False, 'score': 0}
    )

    already_completed = lesson_progress.completed

    if already_completed:
        # Repeat completion: do NOT award repeat XP or inflate streak
        skill_progress = UserSkillProgress.objects.filter(user=user, skill=lesson.skill).first()
        return {
            "lesson_completed": True,
            "already_completed": True,
            "xp_earned": 0,
            "total_xp": profile.xp,
            "perfect": False,
            "streak": profile.streak,
            "skill": {
                "id": lesson.skill.id,
                "title": lesson.skill.title,
                "progress": skill_progress.progress if skill_progress else 100,
                "completed": skill_progress.completed if skill_progress else True,
                "crowns": skill_progress.crowns if skill_progress else 3
            },
            "next_skill_unlocked": True
        }

    # Determine if lesson was perfect (no incorrect submissions for this lesson)
    incorrect_count = UserExerciseSubmission.objects.filter(
        user=user,
        lesson=lesson,
        is_correct=False
    ).count()

    perfect = (incorrect_count == 0)

    # Calculate XP: Base lesson reward + Perfect bonus (10 XP)
    base_xp = lesson.xp_reward
    perfect_bonus = 10 if perfect else 0
    xp_earned = base_xp + perfect_bonus

    # Update Profile XP & Streak
    profile.xp += xp_earned
    profile.streak = calculate_new_streak(profile.streak, profile.last_active_date, current_date)
    profile.last_active_date = current_date
    profile.save()

    # Update DailyProgress for today
    daily_prog, _ = DailyProgress.objects.get_or_create(
        user=user,
        date=current_date,
        defaults={'xp_earned': 0}
    )
    daily_prog.xp_earned += xp_earned
    daily_prog.save()

    # Update UserLessonProgress
    lesson_progress.completed = True
    lesson_progress.score = 100
    lesson_progress.completed_at = timezone.now()
    lesson_progress.save()

    # Update UserSkillProgress for skill
    skill_lessons = Lesson.objects.filter(skill=lesson.skill)
    total_skill_lessons = skill_lessons.count()
    completed_skill_lessons = UserLessonProgress.objects.filter(
        user=user,
        lesson__skill=lesson.skill,
        completed=True
    ).count()

    skill_completed = (completed_skill_lessons >= total_skill_lessons)
    skill_pct = int((completed_skill_lessons / total_skill_lessons) * 100) if total_skill_lessons > 0 else 100
    crowns = 3 if skill_completed else (1 if skill_pct >= 50 else 0)

    sp_obj, _ = UserSkillProgress.objects.get_or_create(
        user=user,
        skill=lesson.skill,
        defaults={'progress': 0, 'completed': False, 'crowns': 0}
    )
    sp_obj.progress = skill_pct
    sp_obj.completed = skill_completed
    sp_obj.crowns = max(sp_obj.crowns, crowns)
    sp_obj.save()

    # Skill Unlocking logic: if skill completed, unlock next skill
    next_skill_unlocked = False
    if skill_completed:
        # Find next skill in unit or next unit
        next_skill = Skill.objects.filter(
            unit=lesson.skill.unit,
            order=lesson.skill.order + 1
        ).first()

        if not next_skill:
            # Next unit's first skill
            next_unit = Lesson.objects.filter(
                skill__unit__course=lesson.skill.unit.course,
                skill__unit__order=lesson.skill.unit.order + 1
            ).first()
            if next_unit:
                next_skill = next_unit.skill

        if next_skill:
            next_sp, _ = UserSkillProgress.objects.get_or_create(
                user=user,
                skill=next_skill,
                defaults={'progress': 0, 'completed': False, 'crowns': 0}
            )
            next_skill_unlocked = True

    return {
        "lesson_completed": True,
        "already_completed": False,
        "xp_earned": xp_earned,
        "total_xp": profile.xp,
        "perfect": perfect,
        "streak": profile.streak,
        "skill": {
            "id": lesson.skill.id,
            "title": lesson.skill.title,
            "progress": sp_obj.progress,
            "completed": sp_obj.completed,
            "crowns": sp_obj.crowns
        },
        "next_skill_unlocked": next_skill_unlocked
    }
