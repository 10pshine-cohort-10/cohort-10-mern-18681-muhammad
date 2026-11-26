import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { createUser, findUserByEmail } from "../dal/user.dal.js";
import {
  createSession,
  findSessionById,
  revokedAllSessions,
  revokeSessionById,
} from "../dal/session.dal.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenExpirationDate,
  hashToken,
  verifyRefreshToken,
} from "./token.service.js";
import { ApiError } from "../utils/ApiError.js";
import {
  IRegisterInput,
  ILoginInput,
  IAuthResult,
} from "../types/auth.types.js";
import { ISafeUser } from "../types/user.types.js";

export const registerUser = async ({
  name,
  email,
  password,
  userAgent,
  ip,
}: IRegisterInput): Promise<IAuthResult> => {
  try {
    const isExist = await findUserByEmail(email);
    if (isExist) {
      throw new ApiError(400, "Email is already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const content = { name, email, password: hashedPassword };
    const user = await createUser(content);
    const sessionId = new mongoose.Types.ObjectId();
    const accessToken = generateAccessToken({ id: user._id.toString(), email });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email,
      sessionId: sessionId.toString(),
    });
    const hashedRefreshToken = hashToken(refreshToken);
    const sessionExpiration = getTokenExpirationDate(refreshToken);

    await createSession({
      _id: sessionId,
      userId: user._id,
      refreshToken: hashedRefreshToken,
      ip,
      userAgent,
      expiresAt: sessionExpiration,
    });

    const userDetails: ISafeUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
    return {
      user: userDetails,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: sessionExpiration,
    };
  } catch (error) {
    throw error;
  }
};

export const loginUser = async ({
  email,
  password,
  ip,
  userAgent,
}: ILoginInput): Promise<IAuthResult> => {
  try {
    const user = await findUserByEmail(email, true);
    if (!user || !user.password) {
      throw new ApiError(401, "Invalid credentials");
    }
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      throw new ApiError(401, "Invalid credentials");
    }
    const sessionId = new mongoose.Types.ObjectId();
    const accessToken = generateAccessToken({ id: user._id.toString(), email });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email,
      sessionId: sessionId.toString(),
    });
    const hashedRefreshToken = hashToken(refreshToken);
    const sessionExpiration = getTokenExpirationDate(refreshToken);

    await createSession({
      _id: sessionId,
      userId: user._id,
      refreshToken: hashedRefreshToken,
      ip,
      userAgent,
      expiresAt: sessionExpiration,
    });

    const userDetails: ISafeUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
    return {
      user: userDetails,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: sessionExpiration,
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async (token: string): Promise<{ message: string }> => {
  try {
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      throw new ApiError(401, "Refresh Token is invalid or expired");
    }
    const session = await findSessionById(decoded.sessionId);
    if (!session || session.refreshToken !== hashToken(token)) {
      throw new ApiError(401, "Refresh Token is invalid or expired");
    }
    await revokeSessionById(decoded.sessionId);
    return { message: "Logged out successfully" };
  } catch (error) {
    throw error;
  }
};

export const logoutAll = async (token: string): Promise<{ message: string }> => {
  try {
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      throw new ApiError(401, "Refresh Token is invalid or expired");
    }
    const session = await findSessionById(decoded.sessionId);
    if (!session || session.refreshToken !== hashToken(token)) {
      throw new ApiError(401, "Refresh Token is invalid or expired");
    }
    await revokedAllSessions(decoded.id);
    return { message: "logged out from all devices successfully" };
  } catch (error) {
    throw error;
  }
};

export const refreshAuthTokens = async (token: string): Promise<string> => {
  try {
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      throw new ApiError(401, "Refresh Token is invalid or expired");
    }
    const session = await findSessionById(decoded.sessionId);
    if (!session || session.expiresAt.getTime() <= Date.now()) {
      throw new ApiError(401, "Refresh Token is invalid or expired");
    }
    const hashedToken = hashToken(token);
    if (session.refreshToken !== hashedToken) {
      throw new ApiError(401, "Refresh Token is invalid or expired");
    }

    return generateAccessToken({ id: session.userId.toString(), email: decoded.email });
  } catch (error) {
    throw error;
  }
};