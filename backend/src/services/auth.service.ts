import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

import { JWT_REFRESH_SECRET } from "../constants/env";
import UserModel from "../models/user.model";
import VerificationCodeType from "../constants/verificationCodeTypes";
import appAssert from "../utils/appAssert";
import jwt from "jsonwebtoken";
import { oneYearFromNow } from "../utils/date";
import sessionModel from "../models/session.model";
import verificationCodeModel from "../models/verificationCode.Model";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // verify that existing user does not already exist
  const existingUser = await UserModel.exists({ email: data.email });
  appAssert(!existingUser, CONFLICT, "Email already exists!");
  // create the new user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });
  
  const userId = user._id;
  
  // create verification code
  const verificationCode = await verificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });
  // send verification email with the code
  // create session
  const session = await sessionModel.create({
    userId,
    userAgent: data.userAgent,
  });
  // sign access token and the refresh token
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  jwt.sign({ sessionId: session._id }, JWT_REFRESH_SECRET, {
    audience: ["user"],
    expiresIn: "30d",
  });

  // sign access token
  const accessToken = signToken({
    userId,
    sessionId: session._id,
  });

  // return user and tokens
  return { user: user.omitPassword(), accessToken, refreshToken };
};

export type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password!");
  // validate password from the request
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password!");
  // create a new session
  const userId = user._id;
  const session = await sessionModel.create({
    userId,
    userAgent,
  });
  const sessionInfo = {
    sessionId: session._id,
  };
  // sign access token and the refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  // sign access token
  const accessToken = signToken({
    userId,
    ...sessionInfo,
  });
  // return user and tokens
  return { user: user.omitPassword(), accessToken, refreshToken };
};
