import { IUserDocument, ISafeUser } from "./user.types.js";
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument | ISafeUser;
    }
  }
}
export {};