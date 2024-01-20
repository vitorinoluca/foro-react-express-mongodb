import { Router } from 'express';
import {
  RegisterController,
  getUserInfoController,
  loginController,
  logoutController,
  registerNameController,
  updateUserInfoController,
} from '../controllers/auth.controller';
import { authVerify } from '../middlewares/auth.middleware';

export const userRoutes = Router();

userRoutes.post('/login', loginController);
userRoutes.post('/register', RegisterController);
userRoutes.get('/user', authVerify, getUserInfoController);
userRoutes.post('/user-name', authVerify, registerNameController);
userRoutes.post('/update', authVerify, updateUserInfoController);
userRoutes.get('/logout', logoutController);
