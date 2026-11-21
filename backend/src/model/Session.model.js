
import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    ip: {
      type: String,
      required: true,
      trim: true,
    },
    userAgent: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    expiresAt:{
        type:Date,
        required:true
    }
  },
  {
    timestamps: true,
  },
);
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
const sessionModel = mongoose.model("Session", sessionSchema);
export default sessionModel;
