import { Types } from "mongoose";
import userModel from "../model/User.model.js";
import { ICreateUserInput, IUserDocument } from "../types/user.types.js";

export const createUser = async (userData: ICreateUserInput): Promise<IUserDocument> => {
  try {
    return await userModel.create(userData);
  } catch (error) {
    throw error;
  }
};

export const findUserByEmail = async (
  email: string,
  includePassword: boolean = false,
): Promise<IUserDocument | null> => {
  try {
    const query = userModel.findOne({ email });
    if (includePassword) {
      query.select("+password");
    }
    return await query;
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (
  id: string | Types.ObjectId,
): Promise<IUserDocument | null> => {
  try {
    return await userModel.findById(id);
  } catch (error) {
    throw error;
  }
};