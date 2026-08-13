from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    xp = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    hearts = models.IntegerField(default=5)
    gems = models.IntegerField(default=500)
    daily_xp_goal = models.IntegerField(default=50)
    last_active_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class Course(models.Model):
    name = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.language})"


class Unit(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='units')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(fields=['course', 'order'], name='unique_unit_order_per_course')
        ]

    def __str__(self):
        return f"Unit {self.order}: {self.title} ({self.course.name})"


class Skill(models.Model):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='skills')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)
    xp_reward = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(fields=['unit', 'order'], name='unique_skill_order_per_unit')
        ]

    def __str__(self):
        return f"Skill {self.order}: {self.title}"


class Lesson(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=150)
    order = models.PositiveIntegerField(default=1)
    xp_reward = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(fields=['skill', 'order'], name='unique_lesson_order_per_skill')
        ]

    def __str__(self):
        return f"Lesson {self.order}: {self.title}"


class Exercise(models.Model):
    class ExerciseType(models.TextChoices):
        MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', 'Multiple Choice'
        TRANSLATE = 'TRANSLATE', 'Translate'
        MATCH_PAIRS = 'MATCH_PAIRS', 'Match Pairs'
        FILL_BLANK = 'FILL_BLANK', 'Fill in the Blank'
        TYPE_ANSWER = 'TYPE_ANSWER', 'Type Answer'
        LISTENING = 'LISTENING', 'Listening'
        SPEAKING = 'SPEAKING', 'Speaking'

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises')
    exercise_type = models.CharField(max_length=50, choices=ExerciseType.choices, default=ExerciseType.MULTIPLE_CHOICE)
    question = models.TextField()
    correct_answer = models.TextField()
    audio_text = models.TextField(blank=True, default='')
    options = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(fields=['lesson', 'order'], name='unique_exercise_order_per_lesson')
        ]

    def __str__(self):
        return f"Exercise {self.order} ({self.exercise_type}) for Lesson: {self.lesson.title}"


class UserSkillProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skill_progresses')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='user_progresses')
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    crowns = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        constraints = [
            models.UniqueConstraint(fields=['user', 'skill'], name='unique_user_skill_progress')
        ]

    def __str__(self):
        return f"SkillProgress ({self.user.username} - {self.skill.title}): {self.progress}%"


class UserLessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progresses')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='user_progresses')
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        constraints = [
            models.UniqueConstraint(fields=['user', 'lesson'], name='unique_user_lesson_progress')
        ]

    def __str__(self):
        return f"LessonProgress ({self.user.username} - {self.lesson.title}): {'Completed' if self.completed else 'In Progress'}"


class DailyProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_progresses')
    date = models.DateField()
    xp_earned = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        constraints = [
            models.UniqueConstraint(fields=['user', 'date'], name='unique_user_daily_progress')
        ]

    def __str__(self):
        return f"DailyProgress ({self.user.username} - {self.date}): {self.xp_earned} XP"


class UserExerciseSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exercise_submissions')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='submissions')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='submissions')
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Submission ({self.user.username} - Ex #{self.exercise.id}): {'Correct' if self.is_correct else 'Incorrect'}"
