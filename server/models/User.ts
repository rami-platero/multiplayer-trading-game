import { Schema, model, Document, Types, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IItem, ISkin } from "./Item";
import { IInitSetup, getRole, initUser } from "../libs/intialSetup";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  socketID: string;
  token: string;
  items?: [IItem];
  skin: ISkin;
  roles: Types.ObjectId[];
}

interface IUserModel extends Model<IUser> {
  signup(
    username: string,
    email: string,
    password: string,
    socketID: string
  ): Promise<IUser>;
  login(username: string, password: string, socketID: string): Promise<IUser>;
}

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
    required: true,
  },
});

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    socketID: { type: String, required: true },
    token: String,
    items: [inventoryItemSchema],
    skin: {
      chatColor: {
        type: String,
        required: true,
      },
      badgeColor: {
        type: String,
        required: true,
      },
    },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role", required: true }],
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (
  username: string,
  email: string,
  password: string,
  socketID: string
): Promise<IUser> {
  if (!email.trim() || !password.trim()) {
    throw Error("All fields must be filled");
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  if (!validator.isAlphanumeric(username)) {
    throw Error("Username can only contain letters and numbers");
  }
  if (!validator.isLength(username, { min: 3, max: 15 })) {
    throw Error("Username must be between 3 and 15 characters");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const initRoles: Types.ObjectId = await getRole();
  const initItems: IInitSetup = await initUser();

  const user: IUser = await this.create({
    username,
    email,
    password: hash,
    socketID,
    roles: [initRoles],
    ...initItems,
  });
  const savedUser = await user.save();

  return savedUser;
};

userSchema.statics.login = async function (
  username: string,
  password: string,
  socketID: string
): Promise<IUser> {
  if (!username.trim() || !password.trim()) {
    throw Error("All fields must be filled");
  }
  const user: IUser = await this.findOne({ username });
  if (!user) {
    throw Error("Incorrect username");
  }
  const match: boolean = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  user.socketID = socketID;
  await user.save();

  return user;
};

export default model<IUser, IUserModel>("User", userSchema);
