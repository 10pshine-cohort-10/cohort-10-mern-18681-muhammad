import sessionModel from "../model/Session.model.js";

export const createSession = async (sessionData) => {
  return await sessionModel.create(sessionData)
}

export const revokeSessionByToken = async (token) => {
  return await sessionModel.findOneAndUpdate(
    { refreshToken: token },
    { isRevoked: true },
  )
}

export const findSessionByToken = async (token) => {
  return await sessionModel.findOne({ refreshToken: token, isRevoked: false })
}

export const revokedAllSessions = async (userId) => {
  return await sessionModel.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true },
  )
}
