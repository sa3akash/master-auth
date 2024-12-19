import { IError } from "../interfaces/error.interface";

export abstract class CustomError extends Error {
  abstract status: string;
  private statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
    };
  }
}

export class BadRequestError extends CustomError {
  status = "error";
  constructor(message: string, statusCode?: number) {
    super(message, statusCode || 500);
  }
}
