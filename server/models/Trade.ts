import mongoose, { Schema, model, Types, Document, Model } from "mongoose";
import User, { IUser } from "./User";
import { IInventory, Item } from "./Item";
import Room from "./Room";

export enum Status {
  Open = "open",
  Locked = "locked",
}

export interface ITrade extends Document {
  itemOffering: Types.ObjectId;
  createdBy: Types.ObjectId;
  tradingWith?: Types.ObjectId;
  status: Status;
  tradingItems: IInventory[];
  coins: number;
}

interface ITradeModel extends Model<ITrade> {
  removeItemFromSeller(
    sellerItem: IInventory,
    sellerName: string,
    sellingItem: string,
    session: mongoose.mongo.ClientSession
  ): Promise<void>;
  addItemsToSeller(
    seller: IUser | null,
    tradingItems: IInventory[],
    session: mongoose.mongo.ClientSession
  ): Promise<void>;
  removeItemsFromBuyer(
    tradingItems: IInventory[],
    buyer: IUser | null,
    session: mongoose.mongo.ClientSession,
  ): Promise<void>;
  addItemToBuyer(
    sellingItem: string,
    buyer: IUser | null,
    session: mongoose.mongo.ClientSession
  ): Promise<void>;
  tradeCoins(
    sellerName: string,
    buyerName: string,
    coins: number,
    session: mongoose.mongo.ClientSession
  ): Promise<void>;
}

export interface IOffer {
  _id: string;
  itemOffering: Item;
  createdBy: IUser;
  tradingWith?: IUser;
  status: Status;
  tradingItems: IInventory[];
  coins: number;
}

const tradeSchema = new Schema({
  /* room: { type: Schema.Types.ObjectId, ref: "Room", required: true }, */
  itemOffering: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tradingWith: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.Open,
    required: true,
  },
  tradingItems: [{itemId: {type: Schema.Types.ObjectId, ref: 'Item', required: true}, count: Number}],
  coins: Number
});

tradeSchema.statics.removeItemFromSeller = async function (
  sellerItem: IInventory,
  sellerName: string,
  sellingItem: string,
  session: mongoose.mongo.ClientSession
) {
  if (sellerItem.count === 1) {
    await User.updateOne(
      { username: sellerName },
      { $pull: { items: { itemId: sellingItem } } },
      { session }
    );
  } else {
    await User.updateOne(
      { username: sellerName, "items.itemId": sellingItem },
      { $inc: { "items.$.count": -1 } },
      { session }
    );
  }
};

tradeSchema.statics.addItemsToSeller = async function (
  seller: IUser | null,
  tradingItems: IInventory[],
  session: mongoose.mongo.ClientSession
) {
  for (const item of tradingItems) {
    const foundItem = seller?.items?.find((it) => {
      return it.itemId.toString() === item.itemId.toString();
    });
    if (foundItem !== undefined) {
      await User.updateOne(
        { username: seller?.username, "items.itemId": item.itemId },
        { $inc: { "items.$.count": +item.count } },
        { session }
      );
    } else {
      await User.updateOne(
        { username: seller?.username },
        { $push: { items: item } },
        { session }
      );
    }
  }
};

tradeSchema.statics.removeItemsFromBuyer = async function (
  tradingItems: IInventory[],
  buyer: IUser | null,
  session: mongoose.mongo.ClientSession,
) {
  for (const item of tradingItems) {
    const foundItem = buyer?.items?.find((it) => {
      return it.itemId.toString() === item.itemId.toString();
    });

    if (foundItem !== undefined) {
      if (item.count.toString() === foundItem?.count.toString()) {
        await User.updateOne(
          { username: buyer?.username },
          { $pull: { items: { itemId: foundItem.itemId } } },
          { session }
        );
      } else if (item.count < foundItem.count) {
        await User.updateOne(
          { username: buyer?.username, "items.itemId": item.itemId },
          { $inc: { "items.$.count": -item.count } },
          { session }
        );
      }
    }
  }
};
tradeSchema.statics.addItemToBuyer = async function (
  sellingItem: string,
  buyer: IUser | null,
  session: mongoose.mongo.ClientSession
) {
  let exists: boolean = false;

  for (const item of buyer?.items!) {
    if (item.itemId.toString() === sellingItem) {
      exists = true;
    }
  }
  if (exists) {
    await User.updateOne(
      { username: buyer?.username, "items.itemId": sellingItem },
      { $inc: { "items.$.count": +1 } },
      { session }
    );
  } else {
    await User.updateOne(
      { username: buyer?.username },
      {
        $push: {
          items: {
            itemId: sellingItem,
            count: 1,
          },
        },
      },
      { session }
    );
  }

  await User.updateOne({ username: buyer?.username }, {}, { session });
};

tradeSchema.statics.tradeCoins = async function (
  sellerName: string,
  buyerName: string,
  coins: number,
  session: mongoose.mongo.ClientSession
) {
  await User.updateOne(
    { username: sellerName },
    {
      $inc: {
        coins: +coins,
      },
    },
    { session }
  );
  await User.updateOne(
    { username: buyerName },
    {
      $inc: {
        coins: -coins,
      },
    },
    { session }
  );
};

tradeSchema.statics.closeOffer = async function (room:string,sellingItem:string){
  const trade = await this.findOne({ itemOffering: sellingItem });
        await this.deleteOne({ itemOffering: sellingItem });
        await Room.updateOne(
          { name: room },
          {
            $pull: {
              offers: trade?._id,
            },
          }
        );
  /* io.to(room).emit("remove-offer", sellingItem); */
}

export default model<ITrade, ITradeModel>("Trade", tradeSchema);
