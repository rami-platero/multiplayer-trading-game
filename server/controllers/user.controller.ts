import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import User from "../models/User";

const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.SECRET!);
};

export const Login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, socketID } = req.body;

  try {
    const user = await User.login(username, password, socketID);
    const token: string = createToken(user._id);
    return res.status(200).json({...user.toObject(),token,password:0});
  } catch (error) {
    return next(error)
  }
};

export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, socketID } = req.body;

  try {
    const user = await User.signup(username, email, password, socketID);
    const token: string = createToken(user._id);
    return res.status(200).json({...user.toObject(),token,password:0});
  } catch (error) {
    return next(error)
  }
};


export const buyItem = async (req: Request, res: Response,next: NextFunction)=>{
  try {
    const {id} = req.params
    const {userID} = req.body
    const {newCoins, boughtItem} = await User.buyItem(userID,id)
    return res.status(200).json({newCoins,boughtItem})
  } catch (error) {
    return next(error)
  }
}

export const removeItem = async (req: Request, res: Response,next: NextFunction)=>{
  try {
    const {id} = req.params
    const {userID} = req.body
    const item = await User.removeItem(userID,id)
    return res.status(200).json({item})
  } catch (error) {
    return next(error)
  }
}



