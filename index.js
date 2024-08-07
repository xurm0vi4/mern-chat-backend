import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import authRouter from './routes/authRouter.js';
import chatRouter from './routes/chatRouter.js';
import messageRouter from './routes/messageRouter.js';

import { app, server, io } from './socket/socket.js';

const PORT = process.env.PORT || 5000;
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('db is connected'))
  .catch((err) => console.log('Error: ', err));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);
app.use('/api/chat', messageRouter);

server.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
