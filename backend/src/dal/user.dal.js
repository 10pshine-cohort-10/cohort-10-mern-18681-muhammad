import userModel from "../model/User.model.js";

export const createUser = async (userData) => {
  return await userModel.create(userData)
}

export const findUserByEmail = async (email, includePassword = false) => {
  const query = userModel.findOne({ email })
  if (includePassword) {
    query.select("+password")
  }
  return await query
}

export const findUserById = async (id) => {
  return await userModel.findById(id)
}
