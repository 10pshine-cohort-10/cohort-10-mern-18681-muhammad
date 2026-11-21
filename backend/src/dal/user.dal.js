import userModel from "../model/User.model.js";

export const createUser = async (userData) => {
  try {
    return await userModel.create(userData)
  } catch (error) {
    throw error
  }
}

export const findUserByEmail = async (email, includePassword = false) => {
  try {
    const query = userModel.findOne({ email })
  if (includePassword) {
    query.select("+password")
  }
  return await query
  } catch (error) {
    throw error
  }
}

export const findUserById = async (id) => {
 try {
   return await userModel.findById(id)
 } catch (error) {
  throw error
 }
}
