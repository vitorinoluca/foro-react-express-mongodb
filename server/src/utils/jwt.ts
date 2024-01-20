import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

export const generateToken = (userId: string): string => {
  const token = jwt.sign({ userId }, JWT_SECRET_KEY);

  return token;
};
