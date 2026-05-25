import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Assessment from '../models/Assessment';
import { assessmentQueue } from '../workers/assessmentWorker';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { material, blueprint, instructions, dueDate, title } = req.body;

    if (!material || !blueprint || !Array.isArray(blueprint) || blueprint.length === 0) {
      return res.status(400).json({ error: 'material and blueprint are required' });
    }

    const jobId = uuidv4();

    const assessment = new Assessment({
      jobId,
      title: title || 'Untitled Assessment',
      status: 'pending',
      material,
      blueprint,
      instructions: instructions || '',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    await assessment.save();

    await assessmentQueue.add('generate', { jobId, material, blueprint, instructions }, {
      jobId,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });

    return res.status(201).json({ jobId, assessmentId: assessment._id.toString(), status: 'pending' });
  } catch (err: any) {
    console.error('POST /api/assessments error:', err);
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const assessment = isObjectId
      ? await Assessment.findById(id)
      : await Assessment.findOne({ jobId: id });
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
    return res.json(assessment);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const assessments = await Assessment.find(
      {},
      { jobId: 1, status: 1, blueprint: 1, dueDate: 1, createdAt: 1, 'result.title': 1, 'result.subject': 1, 'result.totalMarks': 1 }
    ).sort({ createdAt: -1 }).limit(50);
    return res.json(assessments);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const result = isObjectId
      ? await Assessment.findByIdAndDelete(id)
      : await Assessment.findOneAndDelete({ jobId: id });
    if (!result) return res.status(404).json({ error: 'Assessment not found' });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
