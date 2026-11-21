import { createUser, findUserByEmail } from "../dal/user.dal.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "./token.service.js";
import mongoose from "mongoose";
import {
  createSession,
  findSessionById,
  revokedAllSessions,
  revokeSessionById,
} from "../dal/session.dal.js";

export const registerUser = async ({
  name,
  email,
  password,
  userAgent,
  ip,
}) => {
  try {
    const isExist = await findUserByEmail(email);
  if (isExist) {
    throw new ApiError(400, "Email is already registered");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const content = { name, email, password: hashedPassword };
  const user = await createUser(content);
  const sessionId = new mongoose.Types.ObjectId();
  const accessToken = generateAccessToken({ id: user._id, email });
  const refreshToken = generateRefreshToken({
    id: user._id,
    email,
    sessionId,
  });
  const hashedRefreshToken = hashToken(refreshToken);
  const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await createSession({
    _id: sessionId,
    userId: user._id,
    refreshToken: hashedRefreshToken,
    ip,
    userAgent,
    expiresAt: sessionExpiration,
  });
  const userDetails = { _id: user._id, name: user.name, email: user.email };
  return { user:userDetails, accessToken, refreshToken };
  } catch (error) {
    throw error
  }
};

export const loginUser = async ({ email, password, ip, userAgent }) => {
  try {
    const user = await findUserByEmail(email, true);
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }
  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    throw new ApiError(401, "Invalid credentials");
  }
  const sessionId = new mongoose.Types.ObjectId();
  const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const accessToken = generateAccessToken({ id: user._id, email });
  const refreshToken = generateRefreshToken({ id: user._id, email, sessionId });
  const hashedRefreshToken = hashToken(refreshToken);
  await createSession({
    _id: sessionId,
    userId: user._id,
    refreshToken: hashedRefreshToken,
    ip,
    userAgent,
    expiresAt: sessionExpiration,
  });
  const userDetails = { _id: user._id, name: user.name, email: user.email };
  return { userDetails, accessToken, refreshToken };
  } catch (error) {
    throw error
  }
};

export const logout = async (token) => {
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
    throw error
}
};
export const logoutAll = async (token) => {
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
    throw error
 }
};

export const refreshAuthTokens = async (token) => {
 try {
     const decoded = verifyRefreshToken(token);
  if (!decoded) {
    throw new ApiError(401, "Refresh Token is invalid or expired");
  }
  const session = await findSessionById(decoded.sessionId);
  if (!session) {
    throw new ApiError(401, "Refresh Token is invalid or expired");
  }
  const hashedToken = hashToken(token);
  if (session.refreshToken !== hashedToken) {
    throw new ApiError(401, "Refresh Token is invalid or expired");
  }

  return generateAccessToken({ id: session.userId, email: decoded.email });
 } catch (error) {
    throw error
 }
};
