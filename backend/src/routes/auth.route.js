import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginValidation,
  registerValidation,
} from "../validation/auth.validation.js";
import {
    getMe,
  login,
  logoutAlls,
  logouts,
  refresh,
  register,
} from "../controller/auth.controller.js";
import { authValidate } from "../middleware/auth.middleware.js";

const route = Router();

route.post("/register", validate(registerValidation), register);
route.post("/login", validate(loginValidation), login);
route.post("/logout", logouts);
route.post("/logout-all", logoutAlls);
route.post("/refresh", refresh);
route.get('/me',authValidate,getMe)
export default route;
