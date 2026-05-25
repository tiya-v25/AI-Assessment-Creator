import mongoose, { Schema, Document } from 'mongoose';

export interface IBlueprintItem {
  type: 'MCQ' | 'SHORT' | 'DIAGRAM' | 'NUMERICAL';
  quantity: number;
  marks: number;
}

export interface IQuestion {
  index: string;
  text: string;
  marks: number;
  type: 'MCQ' | 'SHORT' | 'DIAGRAM' | 'NUMERICAL';
  difficulty?: 'easy' | 'medium' | 'hard';
  options?: string[];
}

export interface ISection {
  title: string;
  instructions: string;
  questions: IQuestion[];
}

export interface IAssessmentResult {
  title: string;
  subject: string;
  totalMarks: number;
  duration: string;
  generalInstructions: string[];
  sections: ISection[];
  answerKey: { index: string; answer: string }[];
}

export interface IAssessment extends Document {
  jobId: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  material: string;
  dueDate?: Date;
  blueprint: IBlueprintItem[];
  instructions: string;
  result?: IAssessmentResult;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlueprintItemSchema = new Schema<IBlueprintItem>({
  type: { type: String, enum: ['MCQ', 'SHORT', 'DIAGRAM', 'NUMERICAL'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  marks: { type: Number, required: true, min: 1 },
});

const QuestionSchema = new Schema<IQuestion>({
  index: String,
  text: String,
  marks: Number,
  type: { type: String, enum: ['MCQ', 'SHORT', 'DIAGRAM', 'NUMERICAL'] },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  options: [String],
});

const SectionSchema = new Schema<ISection>({
  title: String,
  instructions: String,
  questions: [QuestionSchema],
});

const AssessmentSchema = new Schema<IAssessment>(
  {
    jobId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    title: { type: String, default: 'Untitled Assessment' },
    material: { type: String, required: true },
    dueDate: Date,
    blueprint: { type: [BlueprintItemSchema], required: true },
    instructions: { type: String, default: '' },
    result: { type: Schema.Types.Mixed },
    error: String,
  },
  { timestamps: true }
);

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);
