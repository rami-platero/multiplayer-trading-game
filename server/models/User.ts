import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'

const inventoryItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  count: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    socketID: { type: String, required: true },
    token: String,
    items: [inventoryItemSchema],
    skin: {
      chatColor: String,
      badgeColor: String,
    },
    roles: [{type: Schema.Types.ObjectId, ref: "Role"}]
  },
  { timestamps: true }
);

interface IUser {
  email?: String,
  username: String,
  password: String
}

userSchema.statics.Login = (user: IUser) => {
  try {

  } catch (error) {

  }
};

userSchema.statics.SignUp = (user: IUser) => {
  try {

  } catch (error) {

  }
};

export default model("User", userSchema);
