import { Router } from 'express';
import { authVerify } from '../middlewares/auth.middleware';
import {
  getMessagesByIdController,
  getMessagesController,
  messageReactionController,
  sendMessageController,
} from '../controllers/message.controller';

export const messageRoutes = Router();

messageRoutes.post('/sent-message', authVerify, sendMessageController);
messageRoutes.get('/messages', getMessagesController);
messageRoutes.get('/user/messages', authVerify, getMessagesByIdController);
messageRoutes.put(
  '/messages/:id/reactions',
  authVerify,
  messageReactionController,
);
