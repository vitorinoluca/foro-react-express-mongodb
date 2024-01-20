import type { Request, Response } from 'express';
import {
  getUserInfoService,
  loginService,
  registerNameService,
  registerService,
  updateUserInfoService,
} from '../services/auth.service';

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, password } = req.body;
  const { success, statusCode, msg, token } = await loginService(
    username,
    password,
  );
  if (token != null) {
    res.cookie('authToken', token, {
      sameSite: 'none',
      secure: true,
      httpOnly: false,
    });
  }
  res.status(statusCode).json({ success, msg });
};

export const RegisterController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, password } = req.body;
  const { success, statusCode, msg } = await registerService(
    username,
    password,
  );
  res.status(statusCode).json({ success, msg });
};

export const getUserInfoController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { authToken } = req.cookies;
  const { success, statusCode, msg } = await getUserInfoService(authToken);
  res.status(statusCode).json({ success, msg });
};

export const registerNameController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { authToken } = req.cookies;
  const { name } = req.body;

  const { success, statusCode, msg } = await registerNameService(
    authToken,
    name,
  );
  res.status(statusCode).json({ success, msg });
};

export const updateUserInfoController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { authToken } = req.cookies;
  const { body } = req;

  const { success, statusCode, msg } = await updateUserInfoService(
    authToken,
    body,
  );
  res.status(statusCode).json({ success, msg });
};

export const logoutController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  res.clearCookie('authToken').end();
};
