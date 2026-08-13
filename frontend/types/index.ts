export type ExerciseType = 'multiple_choice' | 'translate' | 'match_pairs' | 'fill_blank' | 'type_answer' | 'listening' | 'speaking';

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  daily_goal: number;
  last_active_date?: string | null;
}

export interface PublicExercise {
  id: number;
  type: ExerciseType;
  question: string;
  options: string[] | Array<{ pair: [string, string] }>;
  data: {
    left_items?: string[];
    right_items?: string[];
    pairs?: Array<{ pair: [string, string] }>;
    audio_text?: string;
    [key: string]: unknown;
  };
  order: number;
}

export interface PublicLessonResponse {
  id: number;
  title: string;
  skill_id: number;
  order: number;
  xp_reward: number;
  exercises: PublicExercise[];
}

export interface SkillHierarchy {
  id: number;
  title: string;
  description: string;
  order: number;
  xp_reward: number;
  progress: number;
  completed: boolean;
  crowns: number;
}

export interface UnitHierarchy {
  id: number;
  title: string;
  description: string;
  order: number;
  skills: SkillHierarchy[];
}

export interface CourseHierarchyResponse {
  id: number;
  name: string;
  language: string;
  description: string;
  units: UnitHierarchy[];
}

export interface SkillProgressItem {
  skill_id: number;
  title: string;
  unit_title: string;
  progress: number;
  completed: boolean;
  crowns: number;
  status: 'completed' | 'in_progress' | 'locked';
}

export interface ProgressResponse {
  user: {
    username: string;
    xp: number;
    streak: number;
    hearts: number;
    gems: number;
    daily_goal: number;
  };
  stats: {
    completed_skills: number;
    total_skills: number;
    completed_lessons: number;
    total_lessons: number;
  };
  skills_progress: SkillProgressItem[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  xp: number;
  streak: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

export interface AnswerSubmissionResponse {
  correct: boolean;
  hearts_remaining: number;
  feedback: string;
  correct_answer?: string;
  lesson_failed?: boolean;
}

export interface LessonCompletionResponse {
  lesson_completed: boolean;
  already_completed?: boolean;
  xp_earned: number;
  total_xp: number;
  perfect: boolean;
  streak: number;
  skill: {
    id: number;
    title: string;
    progress: number;
    completed: boolean;
    crowns: number;
  };
  next_skill_unlocked?: boolean;
}

export interface RefillHeartsResponse {
  hearts: number;
  message: string;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AchievementsResponse {
  achievements: Achievement[];
}

export interface ProfileResponse {
  user: UserResponse & {
    daily_xp: number;
    daily_goal_progress: number;
  };
  stats: {
    completed_skills: number;
    total_skills: number;
    completed_lessons: number;
    total_lessons: number;
  };
  achievements: Achievement[];
}

export interface AIHintResponse {
  hint: string;
}

export interface AIExplainResponse {
  explanation: string;
}

export interface AITutorResponse {
  answer: string;
}

export interface AIWordExplainResponse {
  word: string;
  meaning: string;
  example: string;
  tip: string;
}

export interface AILessonSummaryResponse {
  summary: string;
}

export interface AISpeakingFeedbackResponse {
  feedback: string;
}

export interface AuthResponse {
  user: UserResponse;
  message: string;
}


