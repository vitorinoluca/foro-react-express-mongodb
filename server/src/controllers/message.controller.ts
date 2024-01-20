import type { Request, Response } from 'express';
import {
  getMessagesByIdService,
  getMessagesService,
  messageReactionService,
  sendMessageService,
} from '../services/message.service';
import type { MessageRequest } from '../types';

export const sendMessageController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { message } = req.body;
  const { authToken } = req.cookies;

  const { success, statusCode, msg } = await sendMessageService(
    message,
    authToken,
  );
  res.status(statusCode).json({ success, msg });
};

export const getMessagesController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { success, statusCode, msg } = await getMessagesService();
  res.status(statusCode).json({ success, msg });
};

export const messageReactionController = async (
  req: MessageRequest,
  res: Response,
): Promise<void> => {
  const { action } = req.body;
  const { id } = req.params;
  const { user } = req;

  const { success, statusCode, msg } = await messageReactionService(
    action,
    id,
    user,
  );
  res.status(statusCode).json({ success, msg });
};

export const getMessagesByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { authToken } = req.cookies;

  const { success, statusCode, msg } = await getMessagesByIdService(authToken);
  res.status(statusCode).json({ success, msg });
};
