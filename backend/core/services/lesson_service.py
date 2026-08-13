import re
from core.models import Exercise, UserExerciseSubmission, UserProfile


def normalize_text(text: str) -> str:
    """
    Trims leading/trailing whitespace, converts to lowercase,
    and strips common trailing Spanish/English punctuation marks.
    """
    if not text:
        return ""
    cleaned = text.strip().lower()
    cleaned = re.sub(r'[¡!¿?.,;]', '', cleaned)
    return cleaned.strip()


def validate_exercise_answer(exercise: Exercise, submitted_answer: str) -> tuple[bool, str, str]:
    """
    Validates a submitted answer against the authoritative database answer.
    Returns (is_correct, feedback_message, correct_answer_display).
    """
    expected = exercise.correct_answer or ""
    clean_sub = normalize_text(submitted_answer)
    clean_exp = normalize_text(expected)

    if exercise.exercise_type == Exercise.ExerciseType.MATCH_PAIRS:
        # Match pairs expected format: 'Hola:Hello, Gracias:Thank you'
        # Parse pairs into sorted dict or set
        def parse_pairs(pair_str):
            pairs = set()
            for part in pair_str.split(','):
                if ':' in part:
                    k, v = part.split(':', 1)
                    pairs.add((normalize_text(k), normalize_text(v)))
            return pairs

        sub_pairs = parse_pairs(submitted_answer)
        exp_pairs = parse_pairs(expected)

        is_correct = len(exp_pairs) > 0 and sub_pairs == exp_pairs
        return (
            is_correct,
            "Correct!" if is_correct else "Not quite.",
            expected
        )

    # Simple text / choice comparison
    is_correct = clean_sub == clean_exp

    return (
        is_correct,
        "Correct!" if is_correct else "Not quite.",
        expected
    )


def process_answer_submission(user, lesson, exercise, submitted_answer: str) -> dict:
    """
    Processes an answer submission for a user and exercise, managing hearts.
    """
    profile = UserProfile.objects.get(user=user)

    if profile.hearts <= 0:
        return {
            "correct": False,
            "hearts_remaining": 0,
            "feedback": "You are out of hearts.",
            "lesson_failed": True
        }

    is_correct, feedback, correct_answer_display = validate_exercise_answer(exercise, submitted_answer)

    # Persist submission
    UserExerciseSubmission.objects.create(
        user=user,
        lesson=lesson,
        exercise=exercise,
        is_correct=is_correct
    )

    if not is_correct:
        profile.hearts = max(0, profile.hearts - 1)
        profile.save()

    lesson_failed = (profile.hearts == 0)

    res = {
        "correct": is_correct,
        "hearts_remaining": profile.hearts,
        "feedback": feedback,
        "lesson_failed": lesson_failed
    }

    if not is_correct:
        res["correct_answer"] = correct_answer_display

    return res
