from django.contrib import admin
from .models import (
    UserProfile, Course, Unit, Skill, Lesson, Exercise,
    UserSkillProgress, UserLessonProgress
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'xp', 'streak', 'hearts', 'gems', 'daily_xp_goal', 'last_active_date')
    search_fields = ('user__username', 'user__email')
    list_filter = ('last_active_date',)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'language', 'created_at', 'updated_at')
    search_fields = ('name', 'language')
    list_filter = ('language',)


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'created_at')
    list_filter = ('course',)
    search_fields = ('title', 'description')
    ordering = ('course', 'order')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('title', 'unit', 'order', 'xp_reward', 'created_at')
    list_filter = ('unit__course', 'unit')
    search_fields = ('title', 'description')
    ordering = ('unit', 'order')


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'skill', 'order', 'xp_reward', 'created_at')
    list_filter = ('skill__unit__course', 'skill')
    search_fields = ('title',)
    ordering = ('skill', 'order')


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'lesson', 'exercise_type', 'order', 'question', 'created_at')
    list_filter = ('exercise_type', 'lesson__skill')
    search_fields = ('question', 'correct_answer')
    ordering = ('lesson', 'order')


@admin.register(UserSkillProgress)
class UserSkillProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'progress', 'completed', 'crowns', 'updated_at')
    list_filter = ('completed', 'skill')
    search_fields = ('user__username', 'skill__title')


@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'completed', 'score', 'completed_at', 'updated_at')
    list_filter = ('completed', 'lesson')
    search_fields = ('user__username', 'lesson__title')
