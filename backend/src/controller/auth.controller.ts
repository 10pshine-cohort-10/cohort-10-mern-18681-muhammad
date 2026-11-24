import { Request, Response, NextFunction, CookieOptions } from "express";
import { config } from "../config/env.js";
import {
  loginUser,
  registerUser,
  logout,
  logoutAll,
  refreshAuthTokens,
} from "../service/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { LoginBodyDto, RegisterBodyDto } from "../types/auth.types.js";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (
  req: Request<{},{},RegisterBodyDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const ip = req.ip || "unknown";
    const userAgent = req.get("user-agent") || "unknown";

    const results = await registerUser({
      name,
      email,
      password,
      userAgent,
      ip,
    });

    res.cookie("refreshToken", results.refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: "Registered Successfully",
      user: results.user,
      accessToken: results.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{},{},LoginBodyDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || "unknown";
    const userAgent = req.get("user-agent") || "unknown";

    const results = await loginUser({ email, password, ip, userAgent });

    res.cookie("refreshToken", results.refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: results.user,
      accessToken: results.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = (req.cookies?.refreshToken || req.body?.refreshToken) as string | undefined;
    if (!refreshToken) {
      throw new ApiError(401, "refreshToken is required");
    }

    const results = await logout(refreshToken);
    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: results.message,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAllHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = (req.cookies?.refreshToken || req.body?.refreshToken) as string | undefined;
    if (!refreshToken) {
      throw new ApiError(401, "refreshToken is required");
    }

    const results = await logoutAll(refreshToken);
    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: results.message,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = (req.cookies?.refreshToken || req.body?.refreshToken) as string | undefined;
    if (!refreshToken) {
      throw new ApiError(401, "Refresh Token is required");
    }

    const accessToken = await refreshAuthTokens(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access Token generated successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};