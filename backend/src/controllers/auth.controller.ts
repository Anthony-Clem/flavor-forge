import { CREATED, OK, UNAUTHORIZED } from "../config/http.config";
import { loginSchema, registerSchema } from "../lib/schemas";
import SessionModel from "../models/session.mode";
import { login, refreshAccessToken, register } from "../services/auth.service";
import { appAssert } from "../utils/appAssert";
import { asyncHandler } from "../utils/asyncHandler";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { verifyToken } from "../utils/jwt";

export const registerHandler = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const { accessToken, refreshToken } = await register(data);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json({
      message: "Register successful",
    });
});

export const loginHandler = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const { accessToken, refreshToken } = await login(data);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json({
      message: "Login successful",
    });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res).status(OK).json({
    message: "Logout successful",
  });
});

export const refreshHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  const { accessToken, newRefreshToken } = await refreshAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed",
    });
});

export const checkAuthHandler = asyncHandler(async (req, res) => {
  return res.status(OK).json({
    message: "User authenticated",
  });
});
