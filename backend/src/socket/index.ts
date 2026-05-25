import { Server } from 'socket.io';

let io: Server;

export const setSocketIO = (socketIO: Server): void => {
  io = socketIO;
};

export const emitToJob = (jobId: string, event: string, data: unknown): void => {
  if (io) {
    io.to(`job:${jobId}`).emit(event, data);
  }
};
