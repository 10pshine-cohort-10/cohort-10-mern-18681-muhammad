import { config } from "../config/env.js";
import {
  loginUser,
  registerUser,
  logout,
  logoutAll,
  refreshAuthTokens,
} from "../service/auth.service.js";
import { ApiError } from "../utils/ApiError.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const ip = req.ip;
    const userAgent = req.get("user-agent") || "unknown";
    const results = await registerUser({
      name,
      email,
      password,
      userAgent,
      ip,
    });
    res.cookie("refreshToken", results.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "Registered Successfully",
      user: results.user,
      accessToken: results.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;
    const userAgent = req.get("user-agent") || "unknown";
    const results = await loginUser({ email, password, ip, userAgent });
    res.cookie("refreshToken", results.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: results.userDetails,
      accessToken: results.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logouts = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "refreshToken is required",
      });
    }
    const results = await logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: results.message,
    });
  } catch (error) {
    next(error);
  }
};
export const logoutAlls = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "refreshToken is required",
      });
    }
    const results = await logoutAll(refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: results.message,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token is required",
      });
    }
    const results = await refreshAuthTokens(refreshToken);
    res.status(201).json({
      success: true,
      message: "Access Token generated successfully",
      accessToken: results,
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};
