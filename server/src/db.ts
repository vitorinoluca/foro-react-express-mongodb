import mongoose from 'mongoose';
import { DB_URL } from './config';
import { ERRORS_MSGS, SUCCESS_MSGS } from './constants/responses';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(DB_URL as string);
    console.log(SUCCESS_MSGS.DATABASE_CONNECTED);
  } catch {
    console.log(ERRORS_MSGS.DATABASE_CONNECTION_ERROR);
  }
};
