# Duolingo Clone - Fullstack Language Learning Application

An original, modern, playful, fullstack language-learning web application built for an SDE Fullstack take-home assignment. Built with Next.js 16 + TypeScript on the frontend and Django + Django REST Framework on the backend with SQLite database persistence.

---

## 🌟 Overview & Key Features

This application implements a complete Duolingo-style learning experience with backend-authoritative gamification, progression tracking, and server-side Gemini AI integration.

### 🗺️ Learning Path & Skill Progression
- **Visual Serpentine Path**: Interactive skill tree organized into units with connectors and progress indicators.
- **Dynamic Skill States**: Server-validated `COMPLETED` (gold check + crowns), `AVAILABLE / IN PROGRESS` (emerald ring + CTA modal), and `LOCKED` (muted gray + lock icon) states.
- **Idempotent Data Seeding**: Custom management command (`python manage.py seed_data`) seeding 1 Spanish course, 3 units, 8 skills, 16 lessons, 80 exercises across 5 exercise types, default learner profile, and initial progress.

### 🎮 Interactive Lesson Engine
- **Five Exercise Types**:
  1. `Multiple Choice`: Select the correct translation from options.
  2. `Translate / Word Bank`: Tap word chips in sequence to build translations.
  3. `Match Pairs`: Interactive 2-column word pair matching grid.
  4. `Fill in the Blank`: Complete sentence gaps using option chips.
  5. `Type the Answer`: Controlled text input with whitespace trimming and case-insensitive normalization.
- **Immediate Server Feedback**: Sticky feedback bar with emerald `✓ Correct!` and rose `✕ Not quite` banners.
- **Heart Loss Animations**: Animated `❤️ -1` visual indicator when incorrect answers are submitted.
- **Out-of-Hearts State**: Modal overlay blocking progress when hearts reach 0 with `[ REFILL HEARTS ]` CTA.

### 🤖 Server-Side Gemini AI Integration
- **Secure Backend API Integration**: Uses Google's official `google-genai` Python SDK on Django server (`GEMINI_API_KEY` is 100% server-side and never exposed to client JS).
- **💡 Educational Hints**: `POST /api/ai/hint/` generates constructive hints during exercise attempts without revealing the direct answer.
- **❓ Mistake Explanations**: `POST /api/ai/explain/` provides short 2-3 sentence explanations when an answer is incorrect ("Why was I wrong?").
- **🧠 Interactive AI Tutor**: Dedicated `/tutor` page powered by `POST /api/ai/tutor/` allowing learners to ask Spanish grammar & conjugation questions.
- **📖 Word Breakdowns**: `POST /api/ai/explain-word/` returns structured meaning, example sentences, and grammar tips.
- **📝 Lesson Summaries**: `POST /api/ai/lesson-summary/` generates celebratory post-lesson review summaries.

### 🏆 Gamification & Persistence
- **Hearts System**: 5 hearts max; incorrect answers deduct 1 heart; refill endpoint restores 5 hearts.
- **XP System**: Base lesson reward + Perfect Lesson Bonus (+10 XP for 0 errors). Prevents duplicate XP inflation on repeated completions.
- **Streak System**: Server-validated daily streak calculation supporting same-day, consecutive-day (+1), and missed-day (reset to 1) rules.
- **Daily XP Goal**: Tracks today's earned XP against `user.daily_goal` (e.g. `35 / 50 XP`).
- **Skill Unlocking**: Completing all lessons in a skill atomically unlocks the next skill in the course hierarchy.

### 👤 Learner Profile & Leaderboard
- **Profile Dashboard**: User stats, avatar badge, lifetime XP, streak, skills completed, lessons completed, daily goal progress, and skill progress list.
- **Calculated Achievements**: `First Lesson`, `Three Day Streak`, `100 XP Club`, `Skill Master`.
- **Top 3 Podium Leaderboard**: Prominent 1st, 2nd, 3rd podium badges (`🥇`, `🥈`, `🥉`) and current learner highlight (`← You`).
- **Toast Notifications**: Non-blocking alerts for XP earned, heart refills, and skill unlocks.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: Python 3.12 + Django 5
- **API Engine**: Django REST Framework (DRF)
- **AI SDK**: Official `google-genai` Python SDK
- **CORS**: `django-cors-headers`
- **WSGI / Server**: Gunicorn / WhiteNoise

### Database
- **Database Engine**: SQLite (`db.sqlite3`)

---

## 📐 System Architecture & Data Flow

```text
               USER BROWSER
                    │
                    ▼
          ┌───────────────────┐
          │ NEXT.JS FRONTEND  │
          │ (Port 3000 Local) │
          └─────────┬─────────┘
                    │
                REST API (JSON)
                    │
                    ▼
          ┌───────────────────┐
          │   DJANGO BACKEND  │──────────┐
          │ (Port 8000 Local) │          │ Official google-genai SDK
          └─────────┬─────────┘          │ (GEMINI_API_KEY Server Secret)
                    │                    ▼
                Django ORM     ┌───────────────────┐
                    │          │  GOOGLE GEMINI AI │
                    ▼          │   (Flash Model)   │
          ┌───────────────────┐└───────────────────┘
          │  SQLITE DATABASE  │
          │   (db.sqlite3)    │
          └───────────────────┘
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health/` | API health check | N/A |
| `GET` | `/api/user/` | Default learner profile | N/A |
| `GET` | `/api/profile/` | Stats & achievements | N/A |
| `GET` | `/api/course/` | Course hierarchy (units, skills, lessons) | N/A |
| `GET` | `/api/progress/` | Learner progress summary | N/A |
| `GET` | `/api/leaderboard/` | Ranked learner entries | N/A |
| `GET` | `/api/achievements/` | Calculated achievement statuses | N/A |
| `GET` | `/api/lessons/<id>/` | Lesson exercises (**omits `correct_answer`**) | N/A |
| `POST` | `/api/lessons/<id>/answer/` | Server answer validation | `{"exercise_id": 1, "answer": "Hola"}` |
| `POST` | `/api/lessons/<id>/complete/` | Atomically completes lesson & awards XP | N/A |
| `POST` | `/api/user/refill-hearts/` | Restores learner hearts to 5 | N/A |
| `POST` | `/api/ai/hint/` | Generates AI educational hint | `{"exercise_id": 1, "user_answer": "Adios"}` |
| `POST` | `/api/ai/explain/` | Explains mistake concept | `{"exercise_id": 1, "user_answer": "Adios"}` |
| `POST` | `/api/ai/tutor/` | Answers learner Spanish question | `{"message": "What does Hola mean?"}` |
| `POST` | `/api/ai/explain-word/` | Returns structured word breakdown | `{"word": "comer"}` |
| `POST` | `/api/ai/lesson-summary/` | Generates lesson summary | `{"lesson_id": 1}` |

---

## 🚀 Local Development Setup

### 1. Backend Setup (Django)

```powershell
# Navigate to project root
cd duolingo-clone

# Activate Python virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r backend/requirements.txt

# Run migrations
python backend/manage.py migrate

# Seed deterministic Spanish course data & default learner
python backend/manage.py seed_data

# Start Django development server (http://127.0.0.1:8000)
python backend/manage.py runserver
```

### 2. Frontend Setup (Next.js)

```powershell
# In a new terminal window, navigate to frontend directory
cd duolingo-clone/frontend

# Install frontend dependencies
npm install

# Start Next.js development server (http://localhost:3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Commands

```powershell
# Run Django backend automated unit test suite (16 tests, AI calls mocked)
python backend/manage.py test core

# Run Django system check
python backend/manage.py check

# Verify database migrations status
python backend/manage.py makemigrations --check

# Run Frontend ESLint check
cd frontend && npm run lint

# Run Frontend Next.js production build check
cd frontend && npm run build
```

---

## 🔐 Environment Variables

### Backend (`backend/.env.example`)
```env
DJANGO_SECRET_KEY=django-insecure-duolingo-clone-local-dev-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Gemini AI Key (Backend Only)
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash
```

---

## 📌 Assumptions & Security Guarantees

1. **Strict Key Containment**: `GEMINI_API_KEY` is maintained purely in Django backend environment variables. The Next.js frontend contains zero Google API credentials.
2. **Graceful Fallbacks**: If `GEMINI_API_KEY` is not provided, AI features display `"AI features are currently unavailable"` while core app functionality remains 100% operational.
3. **No Gamification Manipulation**: Gemini AI cannot mutate database progress, XP, hearts, or streaks. Gamification is strictly managed by Django ORM business logic.
