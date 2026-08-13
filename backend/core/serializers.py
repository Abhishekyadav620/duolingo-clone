from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Course, Unit, Skill, Lesson, Exercise,
    UserSkillProgress, UserLessonProgress
)


class UserDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    name = serializers.SerializerMethodField()
    daily_goal = serializers.IntegerField(source='daily_xp_goal')

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'name', 'xp', 'streak',
            'hearts', 'gems', 'daily_goal', 'last_active_date'
        ]

    def get_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name if full_name else obj.user.username


class ExercisePublicSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    data = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        # STRICT SECURITY: correct_answer is NEVER exposed!
        fields = ['id', 'type', 'question', 'options', 'data', 'order']

    def get_type(self, obj):
        mapping = {
            'MULTIPLE_CHOICE': 'multiple_choice',
            'TRANSLATE': 'translate',
            'MATCH_PAIRS': 'match_pairs',
            'FILL_BLANK': 'fill_blank',
            'TYPE_ANSWER': 'type_answer',
            'LISTENING': 'listening',
            'SPEAKING': 'speaking',
        }
        return mapping.get(obj.exercise_type, obj.exercise_type.lower())

    def get_data(self, obj):
        res = {}
        if obj.exercise_type == Exercise.ExerciseType.MATCH_PAIRS:
            # Provide structured pair options without revealing answer mapping
            raw_options = obj.options if isinstance(obj.options, list) else []
            left_items = []
            right_items = []
            for item in raw_options:
                if isinstance(item, dict) and 'pair' in item and len(item['pair']) == 2:
                    left_items.append(item['pair'][0])
                    right_items.append(item['pair'][1])

            res.update({
                'left_items': left_items,
                'right_items': right_items,
                'pairs': raw_options
            })
        elif obj.exercise_type in (Exercise.ExerciseType.LISTENING, Exercise.ExerciseType.SPEAKING):
            res['audio_text'] = obj.audio_text or obj.correct_answer or obj.question
        return res


class LessonPublicSerializer(serializers.ModelSerializer):
    exercises = ExercisePublicSerializer(many=True, read_only=True)
    skill_id = serializers.IntegerField(source='skill.id', read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'skill_id', 'order', 'xp_reward', 'exercises']


class SkillHierarchySerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    completed = serializers.SerializerMethodField()
    crowns = serializers.SerializerMethodField()

    class Meta:
        model = Skill
        fields = ['id', 'title', 'description', 'order', 'xp_reward', 'progress', 'completed', 'crowns']

    def get_progress(self, obj):
        progress_map = self.context.get('skill_progress_map', {})
        prog = progress_map.get(obj.id)
        return prog.progress if prog else 0

    def get_completed(self, obj):
        progress_map = self.context.get('skill_progress_map', {})
        prog = progress_map.get(obj.id)
        return prog.completed if prog else False

    def get_crowns(self, obj):
        progress_map = self.context.get('skill_progress_map', {})
        prog = progress_map.get(obj.id)
        return prog.crowns if prog else 0


class LessonHierarchySerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'order', 'xp_reward', 'completed']

    def get_completed(self, obj):
        lesson_progress_map = self.context.get('lesson_progress_map', {})
        prog = lesson_progress_map.get(obj.id)
        return prog.completed if prog else False


class UnitHierarchySerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = Unit
        fields = ['id', 'title', 'description', 'order', 'skills']

    def get_skills(self, obj):
        skills = obj.skills.all()
        return SkillHierarchySerializer(skills, many=True, context=self.context).data


class CourseHierarchySerializer(serializers.ModelSerializer):
    units = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'language', 'description', 'units']

    def get_units(self, obj):
        units = obj.units.all()
        return UnitHierarchySerializer(units, many=True, context=self.context).data


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    rank = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source='user.username')
    name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['rank', 'username', 'name', 'xp', 'streak']

    def get_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name if full_name else obj.user.username


class HealthCheckSerializer(serializers.Serializer):
    status = serializers.CharField()
    message = serializers.CharField()


class AnswerSubmissionSerializer(serializers.Serializer):
    exercise_id = serializers.IntegerField(required=True)
    answer = serializers.CharField(required=True, allow_blank=True)
