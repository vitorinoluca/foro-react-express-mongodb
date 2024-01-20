import type { Request } from 'express';
import type { Document } from 'mongoose';
export interface ServicesResponse {
  success: boolean;
  msg: string | any;
  statusCode: number;
  token?: string;
}

export interface ServicesResponseWithObjectMsg {
  success: boolean;
  msg: Record<string, any> | string;
  statusCode: number;
  token?: string;
}

export interface MessageRequest extends Request {
  user?: any;
}

export interface AuthRequest extends Request {
  user?: any;
}

export interface User extends Document {
  username: string;
  password: string;
  name: string;
  email: string;
  img: string;
}

export interface Message extends Document {
  dateTime: Date;
  likes: string[];
  dislikes: string[];
  message: string;
  user: string;
  name: string;
  img: string;
}
