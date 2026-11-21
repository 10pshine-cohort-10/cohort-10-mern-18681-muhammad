import { findUserById } from "../dal/user.dal.js";
import { verifyAccessToken } from "../service/token.service.js";
import { ApiError } from "../utils/ApiError.js";

export const authValidate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Access Token Required");
    }
    const accessToken = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(accessToken);
    const user = await findUserById(decoded.id);
    if (!user) {
      throw new ApiError(400, "User does not exist");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
