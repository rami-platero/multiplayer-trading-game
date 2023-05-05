import { Schema, model, Types, Document } from "mongoose";

enum Status {
  Open = "open",
  Locked = "locked"
}

interface ITrade extends Document{
  room: Types.ObjectId,
  createdBy: Types.ObjectId,
  tradingWith?: Types.ObjectId,
  status: Status,
  lockedBy?: Types.ObjectId
}

const tradeSchema = new Schema({
  room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tradingWith: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: Object.values(Status), default: Status.Open, required: true },
  lockedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model<ITrade>('Trade', tradeSchema)