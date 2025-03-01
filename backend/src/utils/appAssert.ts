import assert from "node:assert";
import { HttpStatusCode } from "../config/http.config";
import { AppErrorCode } from "../enum/appErrorCode.enum";
import AppError from "./appError";

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

export const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));
