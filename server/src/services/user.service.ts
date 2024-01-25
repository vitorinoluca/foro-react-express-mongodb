import { HttpStatusCode } from '../constants/http';
import { ERRORS_MSGS, SUCCESS_MSGS } from '../constants/responses';
import type { ServicesResponse } from '../types';
import { UserModel } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { JWT_SECRET_KEY } from '../config';
import jwt from 'jsonwebtoken';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../utils/joi';
import { MessageModel } from '../models/message.model';

export const loginService = async (
  username: string,
  password: string,
): Promise<ServicesResponse> => {
  try {
    const userFound = await UserModel.findOne({ username });

    if (userFound == null) {
      return {
        success: false,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        msg: { username: ERRORS_MSGS.USER_NOT_FOUND },
      };
    }

    const passwordValid = await comparePassword(password, userFound.password);
    if (!passwordValid) {
      return {
        success: false,
        statusCode: HttpStatusCode.BAD_REQUEST,
        msg: { password: ERRORS_MSGS.PASSWORD_INVALID },
      };
    }

    const token = generateToken(userFound._id);
    return {
      success: true,
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.LOGIN_SUCCESSFUL,
      token,
    };
  } catch {
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const registerService = async (
  username: string,
  password: string,
): Promise<ServicesResponse> => {
  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser !== null) {
      return {
        success: false,
        statusCode: HttpStatusCode.BAD_REQUEST,
        msg: { username: ERRORS_MSGS.USER_ALREADY_EXISTS },
      };
    }

    const usernameError: string | null = validateUsername(username);
    const passwordError: string | null = validatePassword(password);

    if (usernameError != null) {
      return {
        success: false,
        statusCode: HttpStatusCode.BAD_REQUEST,
        msg: { username: usernameError },
      };
    }

    if (passwordError != null) {
      return {
        success: false,
        statusCode: HttpStatusCode.BAD_REQUEST,
        msg: { password: passwordError },
      };
    }

    const newUser = new UserModel({
      username,
      password: await hashPassword(password),
    });

    await newUser.save();

    return {
      success: true,
      statusCode: HttpStatusCode.CREATED,
      msg: SUCCESS_MSGS.USER_CREATED,
    };
  } catch {
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const getUserInfoService = async (
  authToken: string,
): Promise<ServicesResponse> => {
  try {
    const { userId }: any = jwt.verify(authToken, JWT_SECRET_KEY);
    const userFound = await UserModel.findById(userId);

    if (userFound == null) {
      return {
        success: false,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        msg: { username: ERRORS_MSGS.USER_NOT_FOUND },
      };
    }

    const userData = {
      id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      img: userFound.img,
    };
    return { success: true, statusCode: HttpStatusCode.OK, msg: userData };
  } catch {
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const registerNameService = async (
  authToken: string,
  name: string,
): Promise<ServicesResponse> => {
  try {
    const decoded: any = jwt.verify(authToken, JWT_SECRET_KEY);
    const userFound = await UserModel.findById(decoded.userId);

    if (userFound == null) {
      return {
        success: false,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        msg: { username: ERRORS_MSGS.USER_NOT_FOUND },
      };
    }

    if (name.length < 4 || name.length > 14) {
      return {
        success: false,
        statusCode: HttpStatusCode.BAD_REQUEST,
        msg: ERRORS_MSGS.INVALID_NAME_LENGTH,
      };
    }

    userFound.name = name;
    await userFound.save();

    return {
      success: true,
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.NAME_REGISTERED,
    };
  } catch {
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const updateUserInfoService = async (
  authToken: string,
  body: { email?: string; name?: string; img?: string },
): Promise<ServicesResponse> => {
  try {
    const { userId } = jwt.verify(authToken, JWT_SECRET_KEY) as {
      userId: string;
    };
    const userFound = await UserModel.findById(userId);

    if (userFound == null) {
      return {
        success: false,
        statusCode: HttpStatusCode.NOT_FOUND,
        msg: ERRORS_MSGS.USER_NOT_FOUND,
      };
    }

    let emailError: string | null = null;

    if (body.email != null) {
      emailError = validateEmail(body.email);
    }

    let existingUserWithEmail;
    if (userFound.email == null) {
      existingUserWithEmail = await UserModel.findOne({
        email: body.email,
      });
      if (existingUserWithEmail === null) {
        if (emailError == null) {
          userFound.email = body.email as string;
        }
      }
    }

    if (body.name != null) {
      userFound.name = body.name;

      await MessageModel.updateMany({ user: userId }, { name: body.name });
    }

    if (body.img != null) {
      userFound.img = body.img;

      await MessageModel.updateMany({ user: userId }, { img: body.img });
    }

    await userFound.save();

    return {
      success: existingUserWithEmail === null && emailError === null,
      statusCode: HttpStatusCode.OK,
      msg:
        existingUserWithEmail != null
          ? { email: ERRORS_MSGS.EMAIL_REGISTERED }
          : emailError != null
            ? { email: emailError }
            : SUCCESS_MSGS.USER_INFO_UPDATED,
    };
  } catch {
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const deleteUserService = async (
  authToken: string,
): Promise<ServicesResponse> => {
  try {
    const { userId } = jwt.verify(authToken, JWT_SECRET_KEY) as {
      userId: string;
    };
    const userFound = await UserModel.findById(userId);

    if (userFound == null) {
      return {
        success: false,
        statusCode: HttpStatusCode.NOT_FOUND,
        msg: ERRORS_MSGS.USER_NOT_FOUND,
      };
    }
    await MessageModel.deleteMany({ user: userFound.id });

    await userFound.deleteOne();
    return {
      success: true,
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.USER_DELETED,
    };
  } catch {
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};
