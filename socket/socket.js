import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://mern-chat-frontend-theta.vercel.app',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('user connected ' + socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

export { app, server, io };
