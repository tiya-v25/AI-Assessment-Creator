import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import Assessment from '../models/Assessment';
import { generateAssessment } from '../services/openai';
import { emitToJob } from '../socket';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

export const assessmentQueue = new Queue('assessment-generation', { connection });

export function initWorker(): void {
  const worker = new Worker(
    'assessment-generation',
    async (job) => {
      const { jobId, material, blueprint, instructions } = job.data as {
        jobId: string;
        material: string;
        blueprint: { type: string; quantity: number; marks: number }[];
        instructions: string;
      };

      try {
        await Assessment.findOneAndUpdate({ jobId }, { status: 'processing' });
        emitToJob(jobId, 'job:status', { jobId, status: 'processing', step: 'Analyzing material...' });

        await delay(800);
        emitToJob(jobId, 'job:status', { jobId, status: 'processing', step: 'Building question blueprint...' });

        await delay(600);
        emitToJob(jobId, 'job:status', { jobId, status: 'processing', step: 'Generating questions with AI...' });

        const result = await generateAssessment(material, blueprint as any, instructions);

        emitToJob(jobId, 'job:status', { jobId, status: 'processing', step: 'Formatting assessment...' });
        await delay(500);

        await Assessment.findOneAndUpdate(
          { jobId },
          { status: 'completed', result },
          { new: true }
        );

        emitToJob(jobId, 'job:complete', { jobId, status: 'completed', result });
        return result;
      } catch (err: any) {
        console.error(`Job ${jobId} failed:`, err.message);
        await Assessment.findOneAndUpdate({ jobId }, { status: 'failed', error: err.message });
        emitToJob(jobId, 'job:error', { jobId, status: 'failed', error: err.message });
        throw err;
      }
    },
    { connection, concurrency: 3 }
  );

  worker.on('completed', (job) => console.log(`✅ Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`❌ Job ${job?.id} failed:`, err.message));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
