import { Schema, model } from 'mongoose';
import type { User } from '../types';

const userSchema = new Schema<User>({
  username: String,
  password: String,
  name: String,
  email: String,
  img: String,
});

export const UserModel = model<User>('User', userSchema);
