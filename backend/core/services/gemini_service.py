import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Import official google-genai SDK safely
try:
    from google import genai
    from google.genai import types
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False
    logger.warning("google-genai SDK is not installed.")

class GeminiService:
    def get_client(self):
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip()

        if not HAS_GENAI:
            return None, model_name

        if not api_key or api_key == "your-gemini-api-key-here":
            return None, model_name

        try:
            return genai.Client(api_key=api_key), model_name
        except Exception as e:
            logger.error(f"Failed to initialize Gemini Client: {e}")
            return None, model_name

    def is_available(self) -> bool:
        client, _ = self.get_client()
        return bool(client)

    def generate_hint(self, question: str, exercise_type: str, user_answer: Optional[str] = None) -> str:
        client, model_name = self.get_client()
        if not client:
            return "Think carefully about the Spanish vocabulary and grammar rules you have learned!"

        prompt = f"""
You are a helpful Spanish tutor assisting a beginner student in a gamified learning app.
Exercise Type: {exercise_type}
Question/Prompt: {question}
Student's current input: {user_answer if user_answer else 'None yet'}

RULES:
1. DO NOT reveal the exact correct answer.
2. Provide a short, encouraging 1-2 sentence educational hint.
3. Help the learner reason toward the answer.
"""
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            return response.text.strip() if response.text else "Review your Spanish vocabulary words carefully."
        except Exception as e:
            logger.error(f"Gemini generate_hint error: {e}")
            return f"AI Hint Error: {str(e)}"

    def explain_mistake(self, question: str, user_answer: str, correct_answer: str) -> str:
        client, model_name = self.get_client()
        if not client:
            return f"The correct answer is '{correct_answer}'. Compare your answer '{user_answer}' to see the difference."

        prompt = f"""
You are an encouraging Spanish tutor explaining a student's mistake.
Question: {question}
Student's Incorrect Answer: {user_answer}
Correct Answer: {correct_answer}

RULES:
1. Explain concisely (2-3 sentences max) why '{user_answer}' is incorrect and why '{correct_answer}' is right.
2. Keep the tone friendly, positive, and educational.
"""
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            return response.text.strip() if response.text else f"'{correct_answer}' is the right translation here."
        except Exception as e:
            logger.error(f"Gemini explain_mistake error: {e}")
            return f"AI Error: {str(e)}"

    def ask_tutor(self, message: str) -> str:
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        if not api_key or api_key == "your-gemini-api-key-here":
            return "AI Tutor is offline: Please create the file backend/.env and paste your real GEMINI_API_KEY=AIzaSy... (Get your free key at https://aistudio.google.com/)."

        client, model_name = self.get_client()
        if not client:
            return "AI Tutor is offline: Failed to authenticate with Google Gemini API. Please check your GEMINI_API_KEY in backend/.env."

        system_instruction = """
You are a friendly, encouraging Spanish AI language tutor named Lingo Buddy.
Rules:
- Explain Spanish grammar & vocabulary simply.
- Give clear examples.
- If asked non-language questions, politely redirect to Spanish learning.
- Keep responses concise (3-5 sentences max).
"""
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=message,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction
                )
            )
            return response.text.strip() if response.text else "I am here to help you learn Spanish! Ask me any question."
        except Exception as e:
            logger.error(f"Gemini ask_tutor error: {e}")
            return f"Gemini API Error: {str(e)}. Please check your API key at https://aistudio.google.com/."

    def explain_word(self, word: str) -> Dict[str, str]:
        client, model_name = self.get_client()
        if not client:
            return {
                "word": word,
                "meaning": "Spanish term",
                "example": f"Ejemplo con {word}.",
                "tip": "Common Spanish word."
            }

        prompt = f"""
Analyze the Spanish word: '{word}'.
Return ONLY a JSON object with this exact key structure:
{{
  "word": "{word}",
  "meaning": "<short English translation>",
  "example": "<short example Spanish sentence>",
  "tip": "<short grammar or context tip>"
}}
"""
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            text = response.text.strip() if response.text else ""
            if text.startswith("```json"):
                text = text.split("```json")[1].split("```")[0].strip()
            elif text.startswith("```"):
                text = text.split("```")[1].split("```")[0].strip()

            data = json.loads(text)
            return {
                "word": data.get("word", word),
                "meaning": data.get("meaning", "Spanish word"),
                "example": data.get("example", ""),
                "tip": data.get("tip", "")
            }
        except Exception as e:
            logger.error(f"Gemini explain_word error: {e}")
            return {
                "word": word,
                "meaning": "Spanish vocabulary word",
                "example": f"Practice using '{word}' in your daily lessons.",
                "tip": "Keep learning!"
            }

    def summarize_lesson(self, lesson_title: str, exercise_questions: list) -> str:
        client, model_name = self.get_client()
        if not client:
            return f"Great job completing '{lesson_title}'! You practiced key Spanish words today."

        questions_str = ", ".join(exercise_questions[:5])
        prompt = f"""
The student just completed the lesson: '{lesson_title}'.
Phrases practiced: {questions_str}

Provide a short, 3-sentence celebratory summary:
1. Praise their accomplishment.
2. Highlight a key concept or phrase practiced.
3. Suggest continuing their streak tomorrow!
"""
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            return response.text.strip() if response.text else f"Great work completing {lesson_title}!"
        except Exception as e:
            logger.error(f"Gemini summarize_lesson error: {e}")
            return f"Congratulations on finishing {lesson_title}! Keep practicing every day."

    def explain_speaking_mistake(self, expected_text: str, recognized_text: str) -> str:
        client, model_name = self.get_client()
        if not client:
            return f"Your answer meant something else than '{expected_text}'. Try saying '{expected_text}' once more."

        prompt = f"""
You are a beginner Spanish language tutor.

Compare the learner's recognized speech with the target Spanish phrase.

Target:
{expected_text}

Learner said:
{recognized_text}

Give a very short and encouraging explanation.

Rules:
- Do not invent pronunciation problems.
- Only discuss the difference between the target and recognized text.
- Do not award XP.
- Do not determine correctness.
- Do not reveal hidden information.
- Keep the response under 3 sentences.
"""
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            return response.text.strip() if response.text else f"Try saying '{expected_text}' once more."
        except Exception as e:
            logger.error(f"Gemini explain_speaking_mistake error: {e}")
            return f"Try saying '{expected_text}' once more."

# Singleton instance
gemini_service = GeminiService()
