from django.contrib.auth.models import User
from .models import UserProfile


def get_default_learner(request=None):
    """
    Returns the currently authenticated user if available in request.
    Otherwise falls back to the default seeded learner User object.
    """
    if request and hasattr(request, 'user') and request.user.is_authenticated:
        return request.user

    user = User.objects.filter(username='learner').first()
    if not user:
        user = User.objects.first()
    return user


def get_default_learner_profile(request=None):
    """
    Returns the UserProfile for the current authenticated user or default learner.
    Auto-creates UserProfile if missing.
    """
    user = get_default_learner(request)
    if user:
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'xp': 0,
                'streak': 1,
                'hearts': 5,
                'gems': 100,
                'daily_xp_goal': 50
            }
        )
        return profile
    return None
