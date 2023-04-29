import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import User from "../models/User";
import { IUser } from "../models/User";

const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.SECRET!);
};

export const Login = async (req: Request, res: Response) => {
  const { username, password, socketID } = req.body;

  try {
    const user = await User.login(username, password, socketID);
    const token: string = createToken(user._id);
    //return res.status(200).header("auth-token", token).json(user);
    return res.status(200).json({...user.toObject(),token,password:0});
  } catch (error: any) {
    console.log(JSON.parse(error.message))
    return res.status(400).send({ error: JSON.parse(error.message) });
  }
};

export const SignUp = async (req: Request, res: Response) => {
  const { username, email, password, socketID } = req.body;

  try {
    console.log("signing up")
    const user = await User.signup(username, email, password, socketID);
    const token: string = createToken(user._id);
    //return res.status(200).header("auth-token", token).json(user);
    return res.status(200).json({...user.toObject(),token,password:0});
  } catch (error: any) {
    return res.status(400).json({ error: JSON.parse(error.message) });
  }
};

/* export const Test = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findById(req.userId);
    console.log(req.userId)
    if (!user) return res.status(404).json("No User Found");
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}; */
