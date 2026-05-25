import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
}

export function subscribeToJob(
  jobId: string,
  onStatus: (data: { jobId: string; status: string; step?: string }) => void,
  onComplete: (data: { jobId: string; status: string; result: any }) => void,
  onError: (data: { jobId: string; status: string; error: string }) => void
): () => void {
  const s = getSocket();
  s.emit('subscribe', jobId);

  // Filter callbacks by jobId to avoid cross-contamination with other open tabs
  const handleStatus = (data: { jobId: string; status: string; step?: string }) => {
    if (data.jobId === jobId) onStatus(data);
  };
  const handleComplete = (data: { jobId: string; status: string; result: any }) => {
    if (data.jobId === jobId) onComplete(data);
  };
  const handleError = (data: { jobId: string; status: string; error: string }) => {
    if (data.jobId === jobId) onError(data);
  };

  s.on('job:status', handleStatus);
  s.on('job:complete', handleComplete);
  s.on('job:error', handleError);

  return () => {
    s.off('job:status', handleStatus);
    s.off('job:complete', handleComplete);
    s.off('job:error', handleError);
  };
}
