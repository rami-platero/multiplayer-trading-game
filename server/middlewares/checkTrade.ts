import { NextFunction } from "express";
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import User, { IUser } from "../models/User";
import { IInventory } from "../models/Item";
import Trade, { IOffer, ITrade } from "../models/Trade";

interface MyParams {
  offerID: string;
}

export interface ITradeData {
    offer: ITrade | null;
    buyer: IUser | null;
    seller: IUser | null;
    sellerItem: IInventory;
    session: mongoose.mongo.ClientSession
}

export const checkTrade = async (
  req: Request<MyParams>,
  res: Response,
  next: NextFunction
) => {
  const io = req.app.get("io");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { offerID } = req.params;
    const offer: ITrade | null = await Trade.findOne({ _id: offerID });
    if (!offer) {
      throw new Error("Offer does not exist.");
    }

    await Trade.deleteOne({_id: offerID})

    // GET USERS
    const buyer: IUser | null = await User.findOne({
      _id: offer.createdBy,
    }).session(session);
    const seller: IUser | null = await User.findOne({
      _id: offer.tradingWith,
    }).session(session);
    if (!seller) {
      throw new Error("This offer has no trader to trade with.");
    }
    // EMIT PROGRESS FUNCTION
    const emitProgress = (num: number) => {
      io.to(buyer?.socketID).to(seller?.socketID).emit("TRADE:PROGRESS", num);
    };
    // EMIT PROGRESS
    io.to(buyer?.socketID).to(seller?.socketID).emit("TRADE:ACCEPT");
    emitProgress(0);
    io.to(buyer?.socketID)
      .to(seller?.socketID)
      .emit("TRADE:STATUS", "Checking items");
    emitProgress(5);

    // CHECK IF THE SELLER HAS THE ITEM
    const sellerItem = seller?.items?.find((item) => {
      return item.itemId === offer.itemOffering;
    });
    if (!sellerItem) {
      throw new Error("Selling item does not exist");
    }
    emitProgress(10);

    // CHECK IF BUYER HAS THE ITEMS
    const buyerItems = offer?.tradingItems.every((item: IInventory) => {
      return buyer?.items?.some((buyerItem) => {
        return (
          item.itemId === buyerItem.itemId && item.count <= buyerItem.count
        );
      });
    });
    if (!buyerItems) {
      throw new Error("Buyer does not have every item that was offered");
    }
    emitProgress(15);

    if (buyer?.coins! < offer.coins) {
      throw new Error("Buyer does not have enough coins to trade");
    }
    emitProgress(20);

    req.tradeData = {offer, buyer, seller, sellerItem,session}
    return next();
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.log(error.message);
    return res.status(400).json(error);
  }
};
