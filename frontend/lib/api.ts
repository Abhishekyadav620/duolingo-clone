import axios from 'axios';
import {
  UserResponse,
  CourseHierarchyResponse,
  ProgressResponse,
  LeaderboardResponse,
  PublicLessonResponse,
  AnswerSubmissionResponse,
  LessonCompletionResponse,
  RefillHeartsResponse,
  AchievementsResponse,
  ProfileResponse,
  AIHintResponse,
  AIExplainResponse,
  AITutorResponse,
  AIWordExplainResponse,
  AILessonSummaryResponse,
  AISpeakingFeedbackResponse,
  AuthResponse
} from '@/types';

const getApiBaseUrl = (): string => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  if (!trimmed.endsWith('/api')) {
    return `${trimmed}/api`;
  }
  return trimmed;
};

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/user/');
  return response.data;
};

export const getCourse = async (): Promise<CourseHierarchyResponse> => {
  const response = await apiClient.get<CourseHierarchyResponse>('/course/');
  return response.data;
};

export const getProgress = async (): Promise<ProgressResponse> => {
  const response = await apiClient.get<ProgressResponse>('/progress/');
  return response.data;
};

export const getLeaderboard = async (): Promise<LeaderboardResponse> => {
  const response = await apiClient.get<LeaderboardResponse>('/leaderboard/');
  return response.data;
};

export const getLesson = async (lessonId: number): Promise<PublicLessonResponse> => {
  const response = await apiClient.get<PublicLessonResponse>(`/lessons/${lessonId}/`);
  return response.data;
};

export const submitAnswer = async (
  lessonId: number,
  exerciseId: number,
  answer: string
): Promise<AnswerSubmissionResponse> => {
  const response = await apiClient.post<AnswerSubmissionResponse>(`/lessons/${lessonId}/answer/`, {
    exercise_id: exerciseId,
    answer,
  });
  return response.data;
};

export const completeLesson = async (lessonId: number): Promise<LessonCompletionResponse> => {
  const response = await apiClient.post<LessonCompletionResponse>(`/lessons/${lessonId}/complete/`);
  return response.data;
};

export const refillHearts = async (): Promise<RefillHeartsResponse> => {
  const response = await apiClient.post<RefillHeartsResponse>('/user/refill-hearts/');
  return response.data;
};

export const getAchievements = async (): Promise<AchievementsResponse> => {
  const response = await apiClient.get<AchievementsResponse>('/achievements/');
  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>('/profile/');
  return response.data;
};

/* Gemini AI Integration Client Methods */
export const getAIHint = async (exerciseId: number, userAnswer?: string): Promise<AIHintResponse> => {
  const response = await apiClient.post<AIHintResponse>('/ai/hint/', {
    exercise_id: exerciseId,
    user_answer: userAnswer || '',
  });
  return response.data;
};

export const getAIExplanation = async (exerciseId: number, userAnswer: string): Promise<AIExplainResponse> => {
  const response = await apiClient.post<AIExplainResponse>('/ai/explain/', {
    exercise_id: exerciseId,
    user_answer: userAnswer,
  });
  return response.data;
};

export const askAITutor = async (message: string): Promise<AITutorResponse> => {
  const response = await apiClient.post<AITutorResponse>('/ai/tutor/', {
    message,
  });
  return response.data;
};

export const explainWord = async (word: string): Promise<AIWordExplainResponse> => {
  const response = await apiClient.post<AIWordExplainResponse>('/ai/explain-word/', {
    word,
  });
  return response.data;
};

export const getLessonSummary = async (lessonId: number): Promise<AILessonSummaryResponse> => {
  const response = await apiClient.post<AILessonSummaryResponse>('/ai/lesson-summary/', {
    lesson_id: lessonId,
  });
  return response.data;
};

export const getAISpeakingFeedback = async (
  expectedText: string,
  recognizedText: string
): Promise<AISpeakingFeedbackResponse> => {
  const response = await apiClient.post<AISpeakingFeedbackResponse>('/ai/speaking-feedback/', {
    expected_text: expectedText,
    recognized_text: recognizedText,
  });
  return response.data;
};

/* Authentication Client Methods */
export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login/', { username, password });
  return response.data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register/', {
    username,
    email,
    password,
    first_name: firstName || '',
    last_name: lastName || '',
  });
  return response.data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/auth/logout/');
  return response.data;
};
