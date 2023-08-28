import { Schema, model, Document, Types, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { IInventory, ISkin, Item } from "./Item";
import IT from "./Item";
import { IInitSetup, getRole, initUser } from "../libs/intialSetup";
import { AppError } from "../helpers/AppError";

interface IBuyItem {
  newCoins: number;
  boughtItem: Item;
}

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
  coins: number;
  isVIP?: boolean 
}

interface IUserModel extends Model<IUser> {
  signup(
    username: string,
    email: string,
    password: string,
    socketID: string
  ): Promise<IUser>;
  login(username: string, password: string, socketID: string): Promise<IUser>;
  buyItem(userID: string, itemID: string): Promise<IBuyItem>;
  removeItem(userID: string, itemID: string): Promise<IInventory | null>;
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
      default: 400,
    },
    isVIP: Boolean
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function () {
  await this.populate({
    path: "items.itemId",
    model: "Item",
  });
  await this.populate("roles");
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
    throw new AppError(400,JSON.stringify({ email: "Email already in use" }));
  }
  const existsName = await this.findOne({ username });
  if (existsName) {
    throw new AppError(400,JSON.stringify({ username: "Username already in use" }));
  }
  if (!validator.isEmail(email)) {
    throw new AppError(400,JSON.stringify({ email: "Email is not valid" }));
  }
  if (!validator.isStrongPassword(password)) {
    throw new AppError(400,JSON.stringify({ password: "Password not strong enough" }));
  }
  if (!validator.isAlphanumeric(username)) {
    throw new AppError(400,
      JSON.stringify({
        username: "Username can only contain letters and numbers",
      })
    );
  }
  if (!validator.isLength(username, { min: 3, max: 15 })) {
    throw new AppError(400,
      JSON.stringify({
        username: "Username must be between 3 and 15 characters",
      })
    );
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
    isVIP: false,
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
    throw new AppError(400,JSON.stringify({ username: "Incorrect username" }));
  }
  const match: boolean = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError(401,JSON.stringify({ password: "Incorrect password" }));
  }

  user.socketID = socketID;
  await user.save();

  return user;
};

userSchema.statics.buyItem = async function (userID: string, itemID: string) {
  const foundUser = await this.findOne({ _id: userID });
  if (!foundUser) {
    throw new Error(JSON.stringify({ message: "User does not exist" }));
  }
  const itemsList = await IT.find();
  const boughtItem = itemsList.find((it) => {
    return it._id.toString() === itemID.toString();
  });
  if (!boughtItem) {
    throw new AppError(404,JSON.stringify({ message: "This item does not exist" }));
  }
  if (!boughtItem.price) {
    throw new AppError(401,JSON.stringify({ message: "This item is not for sale" }));
  }
  if (foundUser.coins < boughtItem?.price!) {
    throw new AppError(
      401,
      JSON.stringify({
        message: "You don't have enough money to buy this item",
      })
    );
  }
  const foundItem = foundUser.items.find((it: IInventory) => {
    return it.itemId._id.toString() === boughtItem._id.toString();
  });
  if (foundItem) {
    foundItem.count += 1;
  } else {
    foundUser.items.push({
      itemId: boughtItem._id,
      count: 1,
    });
  }

  foundUser.coins = foundUser.coins - boughtItem.price;
  await foundUser.save();
  return { newCoins: foundUser.coins, boughtItem };
};

userSchema.statics.removeItem = async function (
  userID: string,
  itemID: string
) {
  const foundUser = await this.findOne({ _id: userID }).populate(
    "items.itemId"
  );
  if (!foundUser) {
    throw new AppError(404,JSON.stringify({ message: "User does not exist" }));
  }
  const foundItem = foundUser.items.find((item: IInventory) => {
    return item.itemId._id.toString() === itemID.toString();
  });
  if (!foundItem) {
    throw new AppError(
      400,
      JSON.stringify({
        message: "This user does not have the item you want to remove",
      })
    );
  }
  if (foundItem.count > 1) {
    foundItem.count--;
    await foundUser.save();
    return foundItem;
  } else {
    foundUser.items.pull({
      "itemId._id": itemID,
      count: 1,
    });
    await foundUser.save();
    return null;
  }
};

export default model<IUser, IUserModel>("User", userSchema);
