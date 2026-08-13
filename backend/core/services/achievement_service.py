from core.models import UserProfile, UserSkillProgress, UserLessonProgress, Skill, Lesson


def get_user_achievements(user) -> list[dict]:
    """
    Calculates achievement statuses dynamically for a user based on learner progress.
    """
    profile = UserProfile.objects.filter(user=user).first()
    xp = profile.xp if profile else 0
    streak = profile.streak if profile else 0

    completed_lessons = UserLessonProgress.objects.filter(user=user, completed=True).count()
    completed_skills = UserSkillProgress.objects.filter(user=user, completed=True).count()

    achievements = [
        {
            "id": "first_lesson",
            "title": "First Lesson",
            "description": "Complete your first lesson.",
            "icon": "🎯",
            "unlocked": completed_lessons >= 1
        },
        {
            "id": "three_day_streak",
            "title": "Three Day Streak",
            "description": "Maintain a 3 day streak.",
            "icon": "🔥",
            "unlocked": streak >= 3
        },
        {
            "id": "hundred_xp",
            "title": "100 XP Club",
            "description": "Earn 100 total XP.",
            "icon": "⭐",
            "unlocked": xp >= 100
        },
        {
            "id": "skill_master",
            "title": "Skill Master",
            "description": "Complete your first skill.",
            "icon": "🏆",
            "unlocked": completed_skills >= 1
        }
    ]

    return achievements
