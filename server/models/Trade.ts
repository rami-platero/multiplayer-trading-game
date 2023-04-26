import { Schema, model } from "mongoose";

const tradeSchema = new Schema({
  room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tradingWith: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["open", "locked"], default: "open" },
  lockedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model('Trade', tradeSchema)