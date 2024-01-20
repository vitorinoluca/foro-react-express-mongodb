import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';
import { UserModel } from '../models/user.model';
import type { AuthRequest } from '../types';

export const authVerify = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { authToken } = req.cookies;

    if (authToken == null) {
      res.status(401).json({ message: 'No estás autenticado' });
      return;
    }

    const decoded: any = jwt.verify(authToken, JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded.userId);

    if (user == null) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }

    req.user = user;

    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};
