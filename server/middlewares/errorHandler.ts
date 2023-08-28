import { NextFunction, Request, Response } from "express";
import { AppError } from "../helpers/AppError";

interface MyParams {
  error: AppError | Error;
}

export const errorHandler = (
  error: unknown,
  _req: Request<MyParams>,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(JSON.parse(error.message));
  }
  return res.status(500).json({ error });
};
