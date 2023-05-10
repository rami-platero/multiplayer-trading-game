import { Schema, model, Document, Types, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IInventory, ISkin } from "./Item";
import { IInitSetup, getRole, initUser } from "../libs/intialSetup";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  socketID: string;
  token: string;
  items?: [IInventory];
  skin: ISkin;
  roles: Types.ObjectId[];
  createdAt: Date;
  coins: number
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
    coins: {
      type: Number,
      default: 400
    }
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function () {
  await this.populate({
    path: 'items.itemId',
    model: 'Item',
  })
  await this.populate('roles')
});

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
    throw Error(JSON.stringify({email: "Email already in use"}));
  }
  const existsName = await this.findOne({ username });
  if(existsName){
    throw Error(JSON.stringify({username: "Username already in use"}))
  }
  if (!validator.isEmail(email)) {
    throw Error(JSON.stringify({email: "Email is not valid"}));
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(JSON.stringify({password: "Password not strong enough"}));
  }
  if (!validator.isAlphanumeric(username)) {
    throw Error(JSON.stringify({username: "Username can only contain letters and numbers"}));
  }
  if (!validator.isLength(username, { min: 3, max: 15 })) {
    throw Error(JSON.stringify({username: "Username must be between 3 and 15 characters"}));
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
  })
  const savedUser = await user.save()

  return savedUser
};

userSchema.statics.login = async function (
  username: string,
  password: string,
  socketID: string
): Promise<IUser> {
  if (!username.trim() || !password.trim()) {
    throw Error("All fields must be filled");
  }
  const user: IUser = await this.findOne({ username })
  if (!user) {
    throw Error(JSON.stringify({username: "Incorrect username"}));
  }
  const match: boolean = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error(JSON.stringify({password: "Incorrect password"}));
  }

  user.socketID = socketID;
  await user.save();

  return user;
};

export default model<IUser, IUserModel>("User", userSchema);
