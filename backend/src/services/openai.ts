import OpenAI from 'openai';
import { IBlueprintItem, IAssessmentResult } from '../models/Assessment';

export async function generateAssessment(
  material: string,
  blueprint: IBlueprintItem[],
  instructions: string
): Promise<IAssessmentResult> {
  // Groq uses an OpenAI-compatible API — keys start with gsk_
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.GROQ_API_KEY
    ? 'https://api.groq.com/openai/v1'
    : undefined; // undefined = default OpenAI endpoint

  const openai = new OpenAI({ apiKey, baseURL });

  // Use llama-3.3-70b-versatile for Groq, gpt-4o-mini for OpenAI
  const model = process.env.GROQ_API_KEY
    ? 'llama-3.3-70b-versatile'
    : 'gpt-4o-mini';

  const blueprintText = blueprint
    .map((b) => `- ${b.type}: ${b.quantity} question(s) × ${b.marks} mark(s) each`)
    .join('\n');

  const totalMarks = blueprint.reduce((sum, b) => sum + b.quantity * b.marks, 0);
  const totalQuestions = blueprint.reduce((sum, b) => sum + b.quantity, 0);

  const systemPrompt = `You are an expert educational assessment creator. Generate a complete, professional exam paper in valid JSON.

IMPORTANT: Return ONLY a JSON object. No markdown, no code fences, no extra text.

JSON Schema:
{
  "title": "string (e.g. Mid-Term Examination)",
  "subject": "string (inferred from material)",
  "totalMarks": number,
  "duration": "string (e.g. 2 Hours)",
  "generalInstructions": ["string", ...],
  "sections": [
    {
      "title": "string (e.g. Section A - Multiple Choice Questions)",
      "instructions": "string",
      "questions": [
        {
          "index": "string (e.g. 1, 2, Q1)",
          "text": "string",
          "marks": number,
          "type": "MCQ|SHORT|DIAGRAM|NUMERICAL",
          "difficulty": "easy|medium|hard",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."]  // only for MCQ
        }
      ]
    }
  ],
  "answerKey": [
    { "index": "string", "answer": "string" }
  ]
}

Rules:
- Create one section per question type
- Generate EXACTLY the number of questions specified in the blueprint
- MCQ must always have 4 options
- Questions must be based on the provided material/topic
- generalInstructions should have 4-5 relevant instructions
- totalMarks must equal ${totalMarks}
- Total questions must equal ${totalQuestions}
- Assign a difficulty to EVERY question: "easy" (recall/basic), "medium" (application), or "hard" (analysis/synthesis)
- Distribute difficulty roughly 40% easy, 40% medium, 20% hard unless instructions say otherwise`;

  const userPrompt = `Material/Topic:
${material}

Question Blueprint:
${blueprintText}

Additional Instructions:
${instructions || 'None'}

Generate the exam paper JSON now.`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  const parsed = JSON.parse(content) as IAssessmentResult;
  return parsed;
}
