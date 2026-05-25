import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export interface BlueprintItem {
  type: 'MCQ' | 'SHORT' | 'DIAGRAM' | 'NUMERICAL';
  quantity: number;
  marks: number;
}

export interface CreateAssessmentPayload {
  material: string;
  blueprint: BlueprintItem[];
  instructions: string;
  dueDate?: string;
  title?: string;
}

export interface Assessment {
  _id: string;
  jobId: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  material: string;
  blueprint: BlueprintItem[];
  instructions: string;
  dueDate?: string;
  result?: AssessmentResult;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  index: string;
  text: string;
  marks: number;
  type: 'MCQ' | 'SHORT' | 'DIAGRAM' | 'NUMERICAL';
  difficulty?: 'easy' | 'medium' | 'hard';
  options?: string[];
}

export interface Section {
  title: string;
  instructions: string;
  questions: Question[];
}

export interface AnswerKey {
  index: string;
  answer: string;
}

export interface AssessmentResult {
  title: string;
  subject: string;
  totalMarks: number;
  duration: string;
  generalInstructions: string[];
  sections: Section[];
  answerKey: AnswerKey[];
}

export const assessmentApi = {
  create: async (payload: CreateAssessmentPayload) => {
    const { data } = await api.post<{ jobId: string; assessmentId: string }>(
      '/api/assessments',
      payload
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Assessment>(`/api/assessments/${id}`);
    return data;
  },

  list: async () => {
    const { data } = await api.get<Assessment[]>('/api/assessments');
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/api/assessments/${id}`);
  },
};
