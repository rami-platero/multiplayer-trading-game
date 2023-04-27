import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface IPayload {
  _id: string;
  iat: number;
  exp: number;
}
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("auth-token");
  if (!token) {return res.status(401).json("Access denied")}

  jwt.verify(token, process.env.SECRET!);

  const payload = jwt.verify(token, process.env.SECRET!) as IPayload;
  req.userId = payload._id

  return next();
};
