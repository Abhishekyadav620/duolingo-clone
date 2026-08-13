from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from core.models import (
    UserProfile, Course, Unit, Skill, Lesson, Exercise,
    UserSkillProgress, UserLessonProgress
)


class Command(BaseCommand):
    help = 'Seeds the database with a beginner Spanish course and a default learner.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Duolingo course data...\n')

        # 1. Seed Default Learner & Leaderboard Users
        leaderboard_users_data = [
            {'username': 'Sofia', 'email': 'sofia@example.com', 'first_name': 'Sofia', 'last_name': 'Rodriguez', 'xp': 820, 'streak': 12, 'hearts': 5, 'gems': 350, 'goal': 50},
            {'username': 'Daniel', 'email': 'daniel@example.com', 'first_name': 'Daniel', 'last_name': 'Kim', 'xp': 710, 'streak': 8, 'hearts': 4, 'gems': 200, 'goal': 50},
            {'username': 'learner', 'email': 'learner@example.com', 'first_name': 'Default', 'last_name': 'Learner', 'xp': 120, 'streak': 3, 'hearts': 5, 'gems': 100, 'goal': 50},
            {'username': 'Mateo', 'email': 'mateo@example.com', 'first_name': 'Mateo', 'last_name': 'Rossi', 'xp': 50, 'streak': 1, 'hearts': 5, 'gems': 80, 'goal': 30},
        ]

        default_user = None
        for u_data in leaderboard_users_data:
            u, created = User.objects.get_or_create(
                username=u_data['username'],
                defaults={
                    'email': u_data['email'],
                    'first_name': u_data['first_name'],
                    'last_name': u_data['last_name']
                }
            )
            if created:
                u.set_password('seedpass123')
                u.save()

            UserProfile.objects.update_or_create(
                user=u,
                defaults={
                    'xp': u_data['xp'],
                    'streak': u_data['streak'],
                    'hearts': u_data['hearts'],
                    'gems': u_data['gems'],
                    'daily_xp_goal': u_data['goal'],
                    'last_active_date': timezone.now().date()
                }
            )
            if u.username == 'learner':
                user = u

        self.stdout.write(self.style.SUCCESS(f'[OK] Default learner & {len(leaderboard_users_data)} leaderboard users seeded'))

        # 2. Seed Course
        course, _ = Course.objects.update_or_create(
            name='Spanish',
            defaults={
                'language': 'Spanish',
                'description': 'Learn Spanish from scratch with basic words, everyday phrases, and simple conversations.'
            }
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Course: {course.name}'))

        # 3. Seed Units
        units_data = [
            {
                'order': 1,
                'title': 'Basics',
                'description': 'Learn basic Spanish words and greetings.'
            },
            {
                'order': 2,
                'title': 'Everyday Spanish',
                'description': 'Practice common words used in everyday conversations.'
            },
            {
                'order': 3,
                'title': 'Conversation',
                'description': 'Build simple Spanish conversation skills.'
            }
        ]

        units_dict = {}
        for u_data in units_data:
            unit, _ = Unit.objects.update_or_create(
                course=course,
                order=u_data['order'],
                defaults={
                    'title': u_data['title'],
                    'description': u_data['description']
                }
            )
            units_dict[u_data['order']] = unit

        self.stdout.write(self.style.SUCCESS(f'[OK] {len(units_dict)} units created/updated'))

        # 4. Seed Skills
        skills_data = [
            # Unit 1
            {'unit_order': 1, 'order': 1, 'title': 'Greetings', 'description': 'Basic greetings and polite expressions.', 'xp_reward': 20},
            {'unit_order': 1, 'order': 2, 'title': 'Common Words', 'description': 'Essential everyday words.', 'xp_reward': 20},
            {'unit_order': 1, 'order': 3, 'title': 'Food', 'description': 'Food, drinks, and dining words.', 'xp_reward': 25},
            # Unit 2
            {'unit_order': 2, 'order': 1, 'title': 'Family', 'description': 'Family members and relationships.', 'xp_reward': 25},
            {'unit_order': 2, 'order': 2, 'title': 'Animals', 'description': 'Common household and wild animals.', 'xp_reward': 25},
            {'unit_order': 2, 'order': 3, 'title': 'Places', 'description': 'Locations and places around town.', 'xp_reward': 30},
            # Unit 3
            {'unit_order': 3, 'order': 1, 'title': 'Questions', 'description': 'Asking and answering simple questions.', 'xp_reward': 30},
            {'unit_order': 3, 'order': 2, 'title': 'Daily Life', 'description': 'Daily routines and activities.', 'xp_reward': 30},
        ]

        skills_dict = {}
        for s_data in skills_data:
            unit = units_dict[s_data['unit_order']]
            skill, _ = Skill.objects.update_or_create(
                unit=unit,
                order=s_data['order'],
                defaults={
                    'title': s_data['title'],
                    'description': s_data['description'],
                    'xp_reward': s_data['xp_reward']
                }
            )
            skills_dict[s_data['title']] = skill

        self.stdout.write(self.style.SUCCESS(f'[OK] {len(skills_dict)} skills created/updated'))

        # 5. Seed Lessons (2 per skill = 16 total)
        lessons_dict = {}
        for skill_title, skill in skills_dict.items():
            l1, _ = Lesson.objects.update_or_create(
                skill=skill,
                order=1,
                defaults={
                    'title': f'{skill_title} 1',
                    'xp_reward': 10
                }
            )
            l2, _ = Lesson.objects.update_or_create(
                skill=skill,
                order=2,
                defaults={
                    'title': f'{skill_title} 2',
                    'xp_reward': 10
                }
            )
            lessons_dict[f'{skill_title}_1'] = l1
            lessons_dict[f'{skill_title}_2'] = l2

        self.stdout.write(self.style.SUCCESS(f'[OK] {len(lessons_dict)} lessons created/updated'))

        # 6. Seed Exercises (~5 exercises per lesson)
        exercises_seed = {
            'Greetings_1': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Hola" mean?',
                    'correct_answer': 'Hello',
                    'options': ['Hello', 'Goodbye', 'Thank you', 'Please']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Goodbye" into Spanish.',
                    'correct_answer': 'adiós',
                    'options': ['hola', 'adiós', 'gracias', 'por favor']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match the Spanish words with their English translations.',
                    'correct_answer': 'Hola:Hello, Gracias:Thank you, Adiós:Goodbye',
                    'options': [
                        {'pair': ['Hola', 'Hello']},
                        {'pair': ['Gracias', 'Thank you']},
                        {'pair': ['Adiós', 'Goodbye']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': '___ días, señor.',
                    'correct_answer': 'Buenos',
                    'options': ['Buenos', 'Buenas', 'Hola', 'Gracias']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Thank you" into Spanish.',
                    'correct_answer': 'gracias',
                    'options': []
                }
            ],
            'Greetings_2': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Por favor" mean?',
                    'correct_answer': 'Please',
                    'options': ['Please', 'Yes', 'No', 'Good morning']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Good morning" into Spanish.',
                    'correct_answer': 'buenos días',
                    'options': ['buenos días', 'buenas noches', 'hasta luego', 'hola']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match the phrases.',
                    'correct_answer': 'Por favor:Please, De nada:You are welcome, Sí:Yes',
                    'options': [
                        {'pair': ['Por favor', 'Please']},
                        {'pair': ['De nada', 'You are welcome']},
                        {'pair': ['Sí', 'Yes']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Hasta ___, amigo.',
                    'correct_answer': 'luego',
                    'options': ['luego', 'gracias', 'hola', 'por']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Yes" into Spanish.',
                    'correct_answer': 'sí',
                    'options': []
                }
            ],
            'Common Words_1': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Casa" mean?',
                    'correct_answer': 'House',
                    'options': ['House', 'Car', 'Book', 'School']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "School" into Spanish.',
                    'correct_answer': 'escuela',
                    'options': ['escuela', 'casa', 'perro', 'agua']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match the common words.',
                    'correct_answer': 'Casa:House, Escuela:School, Libro:Book',
                    'options': [
                        {'pair': ['Casa', 'House']},
                        {'pair': ['Escuela', 'School']},
                        {'pair': ['Libro', 'Book']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'La ___ es grande.',
                    'correct_answer': 'casa',
                    'options': ['casa', 'sí', 'gracias', 'hola']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "No" into Spanish.',
                    'correct_answer': 'no',
                    'options': []
                }
            ],
            'Common Words_2': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Libro" mean?',
                    'correct_answer': 'Book',
                    'options': ['Book', 'Table', 'Pen', 'Bag']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Yo leo un ___.',
                    'correct_answer': 'libro',
                    'options': ['libro', 'perro', 'agua', 'casa']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Friend" into Spanish.',
                    'correct_answer': 'amigo',
                    'options': ['amigo', 'gato', 'pan', 'escuela']
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "House" into Spanish.',
                    'correct_answer': 'casa',
                    'options': []
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match words to meanings.',
                    'correct_answer': 'Amigo:Friend, Sol:Sun, Agua:Water',
                    'options': [
                        {'pair': ['Amigo', 'Friend']},
                        {'pair': ['Sol', 'Sun']},
                        {'pair': ['Agua', 'Water']}
                    ]
                }
            ],
            'Food_1': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Pan" mean?',
                    'correct_answer': 'Bread',
                    'options': ['Bread', 'Water', 'Apple', 'Cheese']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Water" into Spanish.',
                    'correct_answer': 'agua',
                    'options': ['agua', 'pan', 'comida', 'leche']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match food items.',
                    'correct_answer': 'Pan:Bread, Agua:Water, Manzana:Apple',
                    'options': [
                        {'pair': ['Pan', 'Bread']},
                        {'pair': ['Agua', 'Water']},
                        {'pair': ['Manzana', 'Apple']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Yo quiero ___.',
                    'correct_answer': 'agua',
                    'options': ['agua', 'casa', 'perro', 'hola']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Bread" into Spanish.',
                    'correct_answer': 'pan',
                    'options': []
                }
            ],
            'Food_2': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Leche" mean?',
                    'correct_answer': 'Milk',
                    'options': ['Milk', 'Coffee', 'Tea', 'Juice']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Food" into Spanish.',
                    'correct_answer': 'comida',
                    'options': ['comida', 'agua', 'pan', 'fruta']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Me gusta la ___ dulce.',
                    'correct_answer': 'comida',
                    'options': ['comida', 'casa', 'escuela', 'gato']
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match drinks and foods.',
                    'correct_answer': 'Leche:Milk, Café:Coffee, Fruta:Fruit',
                    'options': [
                        {'pair': ['Leche', 'Milk']},
                        {'pair': ['Café', 'Coffee']},
                        {'pair': ['Fruta', 'Fruit']}
                    ]
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Water" into Spanish.',
                    'correct_answer': 'agua',
                    'options': []
                }
            ],
            'Family_1': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Madre" mean?',
                    'correct_answer': 'Mother',
                    'options': ['Mother', 'Father', 'Sister', 'Brother']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Father" into Spanish.',
                    'correct_answer': 'padre',
                    'options': ['padre', 'madre', 'hermano', 'hijo']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match family terms.',
                    'correct_answer': 'Madre:Mother, Padre:Father, Familia:Family',
                    'options': [
                        {'pair': ['Madre', 'Mother']},
                        {'pair': ['Padre', 'Father']},
                        {'pair': ['Familia', 'Family']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Mi ___ es muy buena.',
                    'correct_answer': 'madre',
                    'options': ['madre', 'perro', 'agua', 'pan']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Family" into Spanish.',
                    'correct_answer': 'familia',
                    'options': []
                }
            ],
            'Family_2': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Hermano" mean?',
                    'correct_answer': 'Brother',
                    'options': ['Brother', 'Sister', 'Uncle', 'Cousin']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Sister" into Spanish.',
                    'correct_answer': 'hermana',
                    'options': ['hermana', 'hermano', 'madre', 'padre']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Mi ___ juega fútbol.',
                    'correct_answer': 'hermano',
                    'options': ['hermano', 'casa', 'escuela', 'pan']
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match siblings.',
                    'correct_answer': 'Hermano:Brother, Hermana:Sister, Hijo:Son',
                    'options': [
                        {'pair': ['Hermano', 'Brother']},
                        {'pair': ['Hermana', 'Sister']},
                        {'pair': ['Hijo', 'Son']}
                    ]
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Father" into Spanish.',
                    'correct_answer': 'padre',
                    'options': []
                }
            ],
            'Animals_1': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Perro" mean?',
                    'correct_answer': 'Dog',
                    'options': ['Dog', 'Cat', 'Bird', 'Fish']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Cat" into Spanish.',
                    'correct_answer': 'gato',
                    'options': ['gato', 'perro', 'pájaro', 'pez']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match animals.',
                    'correct_answer': 'Perro:Dog, Gato:Cat, Pájaro:Bird',
                    'options': [
                        {'pair': ['Perro', 'Dog']},
                        {'pair': ['Gato', 'Cat']},
                        {'pair': ['Pájaro', 'Bird']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'El ___ corre feliz.',
                    'correct_answer': 'perro',
                    'options': ['perro', 'pan', 'casa', 'agua']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Dog" into Spanish.',
                    'correct_answer': 'perro',
                    'options': []
                }
            ],
            'Animals_2': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Pez" mean?',
                    'correct_answer': 'Fish',
                    'options': ['Fish', 'Horse', 'Cow', 'Sheep']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Horse" into Spanish.',
                    'correct_answer': 'caballo',
                    'options': ['caballo', 'pez', 'vaca', 'gato']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'El ___ nada en el agua.',
                    'correct_answer': 'pez',
                    'options': ['pez', 'gato', 'perro', 'casa']
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match farm animals.',
                    'correct_answer': 'Caballo:Horse, Vaca:Cow, Pez:Fish',
                    'options': [
                        {'pair': ['Caballo', 'Horse']},
                        {'pair': ['Vaca', 'Cow']},
                        {'pair': ['Pez', 'Fish']}
                    ]
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Cat" into Spanish.',
                    'correct_answer': 'gato',
                    'options': []
                }
            ],
            'Places_1': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Parque" mean?',
                    'correct_answer': 'Park',
                    'options': ['Park', 'Beach', 'City', 'Street']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "City" into Spanish.',
                    'correct_answer': 'ciudad',
                    'options': ['ciudad', 'parque', 'calle', 'plaza']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match places.',
                    'correct_answer': 'Parque:Park, Ciudad:City, Calle:Street',
                    'options': [
                        {'pair': ['Parque', 'Park']},
                        {'pair': ['Ciudad', 'City']},
                        {'pair': ['Calle', 'Street']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Vamos al ___.',
                    'correct_answer': 'parque',
                    'options': ['parque', 'pan', 'perro', 'agua']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Street" into Spanish.',
                    'correct_answer': 'calle',
                    'options': []
                }
            ],
            'Places_2': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Playa" mean?',
                    'correct_answer': 'Beach',
                    'options': ['Beach', 'Mountain', 'River', 'Hotel']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Hospital" into Spanish.',
                    'correct_answer': 'hospital',
                    'options': ['hospital', 'playa', 'banco', 'tienda']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Me gusta ir a la ___.',
                    'correct_answer': 'playa',
                    'options': ['playa', 'casa', 'escuela', 'pan']
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match locations.',
                    'correct_answer': 'Playa:Beach, Tienda:Store, Banco:Bank',
                    'options': [
                        {'pair': ['Playa', 'Beach']},
                        {'pair': ['Tienda', 'Store']},
                        {'pair': ['Banco', 'Bank']}
                    ]
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Park" into Spanish.',
                    'correct_answer': 'parque',
                    'options': []
                }
            ],
            'Questions_1': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "¿Qué?" mean?',
                    'correct_answer': 'What?',
                    'options': ['What?', 'Where?', 'Who?', 'When?']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Where?" into Spanish.',
                    'correct_answer': '¿Dónde?',
                    'options': ['¿Dónde?', '¿Qué?', '¿Quién?', '¿Cuándo?']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match question words.',
                    'correct_answer': '¿Qué?:What?, ¿Dónde?:Where?, ¿Quién?:Who?',
                    'options': [
                        {'pair': ['¿Qué?', 'What?']},
                        {'pair': ['¿Dónde?', 'Where?']},
                        {'pair': ['¿Quién?', 'Who?']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': '¿___ estás?',
                    'correct_answer': 'Dónde',
                    'options': ['Dónde', 'Qué', 'Quién', 'Cómo']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "What?" into Spanish.',
                    'correct_answer': 'qué',
                    'options': []
                }
            ],
            'Questions_2': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "¿Cómo estás?" mean?',
                    'correct_answer': 'How are you?',
                    'options': ['How are you?', 'What is your name?', 'Where do you live?', 'How old are you?']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "When?" into Spanish.',
                    'correct_answer': '¿Cuándo?',
                    'options': ['¿Cuándo?', '¿Por qué?', '¿Cómo?', '¿Cuánto?']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': '¿___ te llamas?',
                    'correct_answer': 'Cómo',
                    'options': ['Cómo', 'Dónde', 'Qué', 'Quién']
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match phrases.',
                    'correct_answer': '¿Cómo estás?:How are you?, ¿Por qué?:Why?, ¿Cuándo?:When?',
                    'options': [
                        {'pair': ['¿Cómo estás?', 'How are you?']},
                        {'pair': ['¿Por qué?', 'Why?']},
                        {'pair': ['¿Cuándo?', 'When?']}
                    ]
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Where?" into Spanish.',
                    'correct_answer': 'dónde',
                    'options': []
                }
            ],
            'Daily Life_1': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Trabajo" mean?',
                    'correct_answer': 'Work',
                    'options': ['Work', 'Sleep', 'Eat', 'Play']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Time" into Spanish.',
                    'correct_answer': 'tiempo',
                    'options': ['tiempo', 'hora', 'día', 'noche']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match daily routine words.',
                    'correct_answer': 'Trabajo:Work, Mañana:Morning, Noche:Night',
                    'options': [
                        {'pair': ['Trabajo', 'Work']},
                        {'pair': ['Mañana', 'Morning']},
                        {'pair': ['Noche', 'Night']}
                    ]
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Yo voy al ___ hoy.',
                    'correct_answer': 'trabajo',
                    'options': ['trabajo', 'pan', 'gato', 'agua']
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Morning" into Spanish.',
                    'correct_answer': 'mañana',
                    'options': []
                }
            ],
            'Daily Life_2': [
                {
                    'order': 1,
                    'exercise_type': Exercise.ExerciseType.MULTIPLE_CHOICE,
                    'question': 'What does "Noche" mean?',
                    'correct_answer': 'Night',
                    'options': ['Night', 'Day', 'Afternoon', 'Week']
                },
                {
                    'order': 2,
                    'exercise_type': Exercise.ExerciseType.TRANSLATE,
                    'question': 'Translate "Day" into Spanish.',
                    'correct_answer': 'día',
                    'options': ['día', 'noche', 'semana', 'mes']
                },
                {
                    'order': 3,
                    'exercise_type': Exercise.ExerciseType.FILL_BLANK,
                    'question': 'Buenas ___, descanses.',
                    'correct_answer': 'noches',
                    'options': ['noches', 'días', 'tardes', 'hola']
                },
                {
                    'order': 4,
                    'exercise_type': Exercise.ExerciseType.MATCH_PAIRS,
                    'question': 'Match time words.',
                    'correct_answer': 'Día:Day, Noche:Night, Hoy:Today',
                    'options': [
                        {'pair': ['Día', 'Day']},
                        {'pair': ['Noche', 'Night']},
                        {'pair': ['Hoy', 'Today']}
                    ]
                },
                {
                    'order': 5,
                    'exercise_type': Exercise.ExerciseType.TYPE_ANSWER,
                    'question': 'Translate "Work" into Spanish.',
                    'correct_answer': 'trabajo',
                    'options': []
                }
            ],
        }

        total_exercises = 0
        for lesson_key, ex_list in exercises_seed.items():
            lesson = lessons_dict[lesson_key]
            for ex_data in ex_list:
                Exercise.objects.update_or_create(
                    lesson=lesson,
                    order=ex_data['order'],
                    defaults={
                        'exercise_type': ex_data['exercise_type'],
                        'question': ex_data['question'],
                        'correct_answer': ex_data['correct_answer'],
                        'options': ex_data['options']
                    }
                )
                total_exercises += 1

        self.stdout.write(self.style.SUCCESS(f'[OK] {total_exercises} exercises created/updated'))

        # 7. Seed Initial Learner Progress
        for skill_title, skill in skills_dict.items():
            if skill_title == 'Greetings':
                UserSkillProgress.objects.update_or_create(
                    user=user,
                    skill=skill,
                    defaults={
                        'progress': 100,
                        'completed': True,
                        'crowns': 3
                    }
                )
            elif skill_title == 'Common Words':
                UserSkillProgress.objects.update_or_create(
                    user=user,
                    skill=skill,
                    defaults={
                        'progress': 40,
                        'completed': False,
                        'crowns': 1
                    }
                )
            else:
                UserSkillProgress.objects.update_or_create(
                    user=user,
                    skill=skill,
                    defaults={
                        'progress': 0,
                        'completed': False,
                        'crowns': 0
                    }
                )

        # Lesson Progress for Learner
        UserLessonProgress.objects.update_or_create(
            user=user,
            lesson=lessons_dict['Greetings_1'],
            defaults={
                'completed': True,
                'score': 100,
                'completed_at': timezone.now()
            }
        )

        UserLessonProgress.objects.update_or_create(
            user=user,
            lesson=lessons_dict['Greetings_2'],
            defaults={
                'completed': False,
                'score': 0,
                'completed_at': None
            }
        )

        UserLessonProgress.objects.update_or_create(
            user=user,
            lesson=lessons_dict['Common Words_1'],
            defaults={
                'completed': False,
                'score': 0,
                'completed_at': None
            }
        )

        self.stdout.write(self.style.SUCCESS('[OK] Initial learner progress created'))
        self.stdout.write(self.style.SUCCESS('\nSeed completed successfully.'))
