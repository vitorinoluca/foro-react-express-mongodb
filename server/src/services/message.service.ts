import { JWT_SECRET_KEY } from '../config';
import { HttpStatusCode } from '../constants/http';
import { ERRORS_MSGS, SUCCESS_MSGS } from '../constants/responses';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import type { ServicesResponse, ServicesResponseWithObjectMsg } from '../types';
import jwt from 'jsonwebtoken';

export const sendMessageService = async (
  message: string,
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

    if (message.length === 0) {
      return {
        success: false,
        statusCode: HttpStatusCode.BAD_REQUEST,
        msg: ERRORS_MSGS.MESSAGE_NOT_VALID,
      };
    }

    if (userFound.name.length === 0) {
      return {
        success: false,
        statusCode: HttpStatusCode.CONFLICT,
        msg: ERRORS_MSGS.NAME_NOT_REGISTERED,
      };
    }

    const newMessage = new MessageModel({
      message,
      name: userFound.name,
      user: userFound._id,
      img: userFound.img,
    });

    await newMessage.save();

    console.log(`El mensaje enviado fue: ${message}`);
    console.log(`Lo envió: ${userFound.name}`);

    return {
      success: true,
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.MESSAGE_SENT,
    };
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const getMessagesService =
  async (): Promise<ServicesResponseWithObjectMsg> => {
    try {
      const messages = await MessageModel.find();

      return { success: true, statusCode: HttpStatusCode.OK, msg: messages };
    } catch {
      return {
        success: false,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
      };
    }
  };

export const messageReactionService = async (
  action: string,
  id: string,
  user: any,
): Promise<ServicesResponse> => {
  try {
    if (action === 'like') {
      await MessageModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { likes: user._id },
          $pull: { dislikes: user._id },
        },
        { new: true },
      );
    } else if (action === 'dislike') {
      await MessageModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { dislikes: user._id },
          $pull: { likes: user._id },
        },
        { new: true },
      );
    } else if (action === '') {
      const message = await MessageModel.findById(id);

      if (message == null) {
        return {
          success: false,
          statusCode: HttpStatusCode.NOT_FOUND,
          msg: ERRORS_MSGS.USER_NOT_FOUND,
        };
      }

      if (message.likes.includes(user._id)) {
        await MessageModel.findByIdAndUpdate(
          id,
          {
            $pull: { likes: user._id },
          },
          { new: true },
        );
      } else if (message.dislikes.includes(user._id)) {
        await MessageModel.findByIdAndUpdate(
          id,
          {
            $pull: { dislikes: user._id },
          },
          { new: true },
        );
      }
    } else {
      return {
        success: false,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      success: true,
      statusCode: HttpStatusCode.OK,
      msg: SUCCESS_MSGS.REACTION_UPDATED,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};

export const getMessagesByIdService = async (
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

    const messages = await MessageModel.find({ user: userFound.id }).lean();

    return { success: true, statusCode: HttpStatusCode.OK, msg: messages };
  } catch {
    return {
      success: false,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      msg: ERRORS_MSGS.INTERNAL_SERVER_ERROR,
    };
  }
};
