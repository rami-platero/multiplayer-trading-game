import { Schema, model, Types, Document } from "mongoose";
import { IUser } from "./User";

export enum Status {
  Open = "open",
  Locked = "locked"
}

export interface ITrade extends Document{
  /* room: Types.ObjectId, */
  itemTrading: Types.ObjectId
  createdBy: Types.ObjectId,
  tradingWith?: Types.ObjectId | IUser,
  status: Status,
}

const tradeSchema = new Schema({
  /* room: { type: Schema.Types.ObjectId, ref: "Room", required: true }, */
  itemTrading: {type: Schema.Types.ObjectId, ref: "Item", required: true},
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tradingWith: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: Object.values(Status), default: Status.Open, required: true }
});

export default model<ITrade>("Trade", tradeSchema)