import 'dotenv/config';

export const DB_URL = process.env.DB_URL as string;
export const PORT = process.env.PORT as string;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export const FRONTEND_URL =
  process.env.FRONTEND_URL != null || ('http://localhost:5173' as string);
