import { Schema, model, Types } from 'mongoose';
import type { Message } from '../types';

const messageSchema = new Schema({
  dateTime: { type: Date, default: Date.now },
  likes: [{ type: Types.ObjectId, ref: 'User', default: 0 }],
  dislikes: [{ type: Types.ObjectId, ref: 'User', default: 0 }],
  message: { type: String, required: true },
  user: { type: Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  img: String,
});

export const MessageModel = model<Message>('Message', messageSchema);
