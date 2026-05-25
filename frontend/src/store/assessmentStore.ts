import { create } from 'zustand';
import { Assessment, BlueprintItem } from '@/lib/api';

export type CreateStep = 1 | 2 | 3;

interface CreateFormState {
  step: CreateStep;
  material: string;
  title: string;
  dueDate: string;
  instructions: string;
  blueprint: BlueprintItem[];
}

interface AssessmentStore {
  // List
  assessments: Assessment[];
  setAssessments: (assessments: Assessment[]) => void;
  addAssessment: (assessment: Assessment) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;

  // Active job tracking
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;
  jobStep: string;
  setJobStep: (step: string) => void;

  // Create form
  form: CreateFormState;
  setFormStep: (step: CreateStep) => void;
  setFormField: <K extends keyof CreateFormState>(key: K, value: CreateFormState[K]) => void;
  addBlueprintRow: () => void;
  updateBlueprintRow: (index: number, field: keyof BlueprintItem, value: any) => void;
  removeBlueprintRow: (index: number) => void;
  resetForm: () => void;
}

const defaultForm: CreateFormState = {
  step: 1,
  material: '',
  title: '',
  dueDate: '',
  instructions: '',
  blueprint: [
    { type: 'MCQ', quantity: 5, marks: 2 },
    { type: 'SHORT', quantity: 3, marks: 5 },
  ],
};

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  assessments: [],
  setAssessments: (assessments) => set({ assessments }),
  addAssessment: (assessment) =>
    set((s) => ({ assessments: [assessment, ...s.assessments] })),
  updateAssessment: (id, updates) =>
    set((s) => ({
      assessments: s.assessments.map((a) =>
        a._id === id || a.jobId === id ? { ...a, ...updates } : a
      ),
    })),

  activeJobId: null,
  setActiveJobId: (id) => set({ activeJobId: id }),
  jobStep: '',
  setJobStep: (step) => set({ jobStep: step }),

  form: { ...defaultForm },
  setFormStep: (step) => set((s) => ({ form: { ...s.form, step } })),
  setFormField: (key, value) =>
    set((s) => ({ form: { ...s.form, [key]: value } })),
  addBlueprintRow: () =>
    set((s) => ({
      form: {
        ...s.form,
        blueprint: [...s.form.blueprint, { type: 'MCQ', quantity: 1, marks: 2 }],
      },
    })),
  updateBlueprintRow: (index, field, value) =>
    set((s) => ({
      form: {
        ...s.form,
        blueprint: s.form.blueprint.map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        ),
      },
    })),
  removeBlueprintRow: (index) =>
    set((s) => ({
      form: {
        ...s.form,
        blueprint: s.form.blueprint.filter((_, i) => i !== index),
      },
    })),
  resetForm: () => set({ form: { ...defaultForm } }),
}));
