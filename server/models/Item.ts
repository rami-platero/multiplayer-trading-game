import { Schema, model, Document, Types } from "mongoose";

export interface IInventory {
  itemId: Types.ObjectId | Item;
  count: number;
}

export interface ISkin {
  chatColor: string;
  badgeColor: string
}

interface Item extends Document {
  name: string;
  type: string;
  isSkin: boolean;
  skinData?: ISkin
  image: string;
}

const itemSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  isSkin: { type: Boolean, required: true },
  skinData: {
    chatColor: String,
    badgeColor: String,
  },
  image: { type: String, required: true },
});

export default model<Item>("Item", itemSchema);
