import { HttpStatusCode } from "../config/http.config";
import { AppErrorCode } from "../enum/appErrorCode.enum";

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

export default AppError;
