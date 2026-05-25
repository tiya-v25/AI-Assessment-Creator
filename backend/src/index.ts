import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import assessmentRoutes from './routes/assessments';
import { initWorker } from './workers/assessmentWorker';
import { setSocketIO } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const io = new Server(server, {
  cors: { origin: frontendUrl, methods: ['GET', 'POST'] },
});

setSocketIO(io);

app.use(cors({ origin: frontendUrl }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/assessments', assessmentRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('subscribe', (jobId: string) => {
    socket.join(`job:${jobId}`);
    console.log(`📡 ${socket.id} subscribed to job:${jobId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_assessments';
const host = process.env.HOST || '127.0.0.1';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected');
    initWorker();
    console.log('✅ BullMQ worker initialized');

    const port = parseInt(process.env.PORT || '3001', 10);
    server.listen(port, host, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
