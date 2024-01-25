import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { messageRoutes } from './routes/message.route';
import { userRoutes } from './routes/user.route';
import { FRONTEND_URL } from './config';

export const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(messageRoutes);
app.use(userRoutes);
