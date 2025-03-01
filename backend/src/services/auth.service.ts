import { CONFLICT, UNAUTHORIZED } from "../config/http.config";
import { AuthParams } from "../lib/types";
import SessionModel from "../models/session.mode";
import UserModel from "../models/user.model";
import { appAssert } from "../utils/appAssert";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";

export const register = async ({ email, password }: AuthParams) => {
  const existingUser = await UserModel.exists({ email });
  appAssert(!existingUser, CONFLICT, "Email already in use");

  const user = await UserModel.create({
    email,
    password,
  });

  const userId = user._id;

  const session = await SessionModel.create({ userId });

  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );
  const accessToken = signToken({ userId, sessionId: session._id });

  return {
    accessToken,
    refreshToken,
  };
};

export const login = async ({ email, password }: AuthParams) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid credentials");

  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid credentials");

  const userId = user._id;

  const session = await SessionModel.create({ user });

  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  const sessionNeedsRefresh =
    session.expiresAt.getTime() - now < 24 * 60 * 60 * 1000;

  if (sessionNeedsRefresh) {
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};
