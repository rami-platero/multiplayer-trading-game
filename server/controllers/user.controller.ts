import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import User from "../models/User";

const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.SECRET!);
};

export const Login = async (req: Request, res: Response) => {
  const { username, password, socketID } = req.body;

  try {
    const user = await User.login(username, password, socketID);
    const token: string = createToken(user._id);
    return res.status(200).json({...user.toObject(),token,password:0});
  } catch (error: any) {
    console.log(JSON.parse(error.message))
    return res.status(400).send({ error: JSON.parse(error.message) });
  }
};

export const SignUp = async (req: Request, res: Response) => {
  const { username, email, password, socketID } = req.body;

  try {
    const user = await User.signup(username, email, password, socketID);
    const token: string = createToken(user._id);
    return res.status(200).json({...user.toObject(),token,password:0});
  } catch (error: any) {
    return res.status(400).json({ error: JSON.parse(error.message) });
  }
};


export const buyItem = async (req: Request, res: Response)=>{
  try {
    const {id} = req.params
    const {userID} = req.body
    const {newCoins, boughtItem} = await User.buyItem(userID,id)
    return res.status(200).json({newCoins,boughtItem})
  } catch (error:any) {
    return res.status(400).json(JSON.parse(error.message));
  }
}

export const removeItem = async (req: Request, res: Response)=>{
  try {
    const {id} = req.params
    const {userID} = req.body
    const item = await User.removeItem(userID,id)
    return res.status(200).json({item})
  } catch (error:any) {
    return res.status(400).json(JSON.parse(error.message));
  }
}



