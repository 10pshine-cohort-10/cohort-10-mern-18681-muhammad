import { findUserById } from "../dal/user.dal.js";
import { verifyAccessToken } from "../service/token.service.js";
import { IAccessTokenPayload } from "../types/auth.types.js";
import { ApiError } from "../utils/ApiError.js";
import {Request,Response,NextFunction} from 'express'

export const authValidate = async (req:Request, res:Response, next:NextFunction)
:Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Access Token Required");
    }
    const accessToken = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(accessToken) as IAccessTokenPayload;
    const user = await findUserById(decoded.id);
    if (!user) {
      throw new ApiError(400, "User does not exist");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
