import sessionModel from "../model/Session.model.js";

export const createSession = async (sessionData) => {
  try {
    return await sessionModel.create(sessionData);
  } catch (error) {
    throw error;
  }
};

export const revokeSessionByToken = async (token) => {
  try {
    return await sessionModel.findOneAndUpdate(
      { refreshToken: token },
      { isRevoked: true },
    );
  } catch (error) {
    throw error;
  }
};

export const findSessionByToken = async (token) => {
  try {
    return await sessionModel.findOne({
      refreshToken: token,
      isRevoked: false,
    });
  } catch (error) {
    throw error;
  }
};

export const revokedAllSessions = async (userId) => {
  try {
    return await sessionModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  } catch (error) {
    throw error;
  }
};

export const findSessionById = async (sessionId) => {
  try {
    return sessionModel.findOne({ _id: sessionId, isRevoked: false });
  } catch (error) {
    throw error;
  }
};
export const revokeSessionById = async (sessionId) => {
  try {
    return sessionModel.findByIdAndUpdate(sessionId, { isRevoked: true });
  } catch (error) {
    throw error;
  }
};
