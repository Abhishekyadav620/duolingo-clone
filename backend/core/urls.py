from django.urls import path
from .views import (
    health_check, UserDetailView, CourseDetailView,
    UserProgressView, LessonDetailView, LeaderboardView,
    AnswerSubmissionView, LessonCompletionView, HeartRefillView,
    AchievementView, ProfileView, AIHintView, AIExplainView,
    AITutorView, AIWordExplainView, AILessonSummaryView, AISpeakingFeedbackView,
    RegisterView, LoginView, LogoutView
)

urlpatterns = [
    path('health/', health_check, name='health_check'),

    # Authentication Endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),

    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('user/refill-hearts/', HeartRefillView.as_view(), name='heart_refill'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('achievements/', AchievementView.as_view(), name='achievements'),
    path('course/', CourseDetailView.as_view(), name='course_detail'),
    path('progress/', UserProgressView.as_view(), name='user_progress'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('lessons/<int:lesson_id>/', LessonDetailView.as_view(), name='lesson_detail'),
    path('lessons/<int:lesson_id>/answer/', AnswerSubmissionView.as_view(), name='answer_submission'),
    path('lessons/<int:lesson_id>/complete/', LessonCompletionView.as_view(), name='lesson_completion'),

    # Gemini AI Feature Endpoints
    path('ai/hint/', AIHintView.as_view(), name='ai_hint'),
    path('ai/explain/', AIExplainView.as_view(), name='ai_explain'),
    path('ai/tutor/', AITutorView.as_view(), name='ai_tutor'),
    path('ai/explain-word/', AIWordExplainView.as_view(), name='ai_explain_word'),
    path('ai/lesson-summary/', AILessonSummaryView.as_view(), name='ai_lesson_summary'),
    path('ai/speaking-feedback/', AISpeakingFeedbackView.as_view(), name='ai_speaking_feedback'),
]
