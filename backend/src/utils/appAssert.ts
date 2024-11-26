import AppError from "./AppError";
import AppErrorCode from "../constants/AppErrorCode";
import { HttpStatusCode } from "../constants/http";
import assert from "node:assert";

/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;