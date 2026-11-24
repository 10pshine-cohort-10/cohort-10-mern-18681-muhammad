import { Schema, model, Model } from "mongoose";
import { IUserDocument } from "../types/user.types.js";

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      
    },
  },
  {
    timestamps: true,
  },
);

const userModel: Model<IUserDocument> = model<IUserDocument>("Users", userSchema);
export default userModel;