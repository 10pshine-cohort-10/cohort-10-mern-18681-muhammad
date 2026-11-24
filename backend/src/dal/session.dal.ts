import { Types } from "mongoose";
import sessionModel from "../model/Session.model.js";
import {  ISessionDocument, ISessionInput } from "../types/session.types.js";

export const createSession = async (sessionData:ISessionInput) :Promise<ISessionDocument>=> {
  try {
    return await sessionModel.create(sessionData);
  } catch (error) {
    throw error;
  }
};

export const revokeSessionByToken = async (token:string) :Promise<ISessionDocument | null>=> {
  try {
    return await sessionModel.findOneAndUpdate(
      { refreshToken: token },
      { isRevoked: true },
    );
  } catch (error) {
    throw error;
  }
};

export const findSessionByToken = async (token:string) : Promise<ISessionDocument|null> => {
  try {
    return await sessionModel.findOne({
      refreshToken: token,
      isRevoked: false,
    });
  } catch (error) {
    throw error;
  }
};

export const revokedAllSessions = async (userId:string |Types.ObjectId):Promise<void> => {
  try {
    await sessionModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  } catch (error) {
    throw error;
  }
};

export const findSessionById = async (sessionId:string |Types.ObjectId):Promise<ISessionDocument|null> => {
  try {
    return sessionModel.findOne({ _id: sessionId, isRevoked: false });
  } catch (error) {
    throw error;
  }
};
export const revokeSessionById = async (sessionId:string | Types.ObjectId) :Promise<ISessionDocument|null> => {
  try {
    return sessionModel.findByIdAndUpdate(sessionId, { isRevoked: true });
  } catch (error) {
    throw error;
  }
};
