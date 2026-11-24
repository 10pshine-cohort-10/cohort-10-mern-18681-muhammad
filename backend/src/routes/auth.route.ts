import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginValidation,
  registerValidation,
} from "../validation/auth.validation.js";
import {
  getMe,
  login,
  logoutAllHandler,
  logoutHandler,
  refresh,
  register,
} from "../controller/auth.controller.js";
import { authValidate } from "../middleware/auth.middleware.js";

const route: Router = Router();

route.post("/register", validate(registerValidation), register);
route.post("/login", validate(loginValidation), login);
route.post("/logout", logoutHandler);
route.post("/logout-all", logoutAllHandler);
route.post("/refresh", refresh);
route.get("/me", authValidate, getMe);

export default route;