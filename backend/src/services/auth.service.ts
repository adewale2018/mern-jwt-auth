import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

import UserModel from "../models/user.model";
import VerificationCodeType from "../constants/verificationCodeTypes";
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
  if (existingUser) {
    throw new Error("User already exists!");
  }
  // create the new user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });
  // create verification code
  const verificationCode = await verificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });
  // send verification email with the code
  // create session
  const session = await sessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });
  // sign access token and the refresh token
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  // sign access token
  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );
  // return user and tokens
  return { user, accessToken, refreshToken };
};
