import { NextFunction } from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import { IInventory } from "../models/Item";
import Trade, { ITrade } from "../models/Trade";
import Room from "../models/Room";

interface MyParams {
  offerID: string;
}

export interface ITradeData {
    offer: ITrade | null;
    buyer: IUser | null;
    seller: IUser | null;
    sellerItem: IInventory;
    session: mongoose.mongo.ClientSession
    emitProgress:(num: number)=>void
    filteredItems: IInventory[] | []
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
    const {room} = req.body
    const offer: ITrade | null = await Trade.findOne({ _id: offerID });
    if (!offer) {
      throw new Error("Offer does not exist.");
    }
    const trade = await Trade.findOneAndDelete({_id: offerID},{new:true})
    await Room.updateOne({name: room},{$pull:{offers: offerID}})
    io.to(room).emit("remove-offer",trade?.itemOffering.toString())
    // GET USERS
    const buyer: IUser | null = await User.findOne({
      _id: offer.tradingWith,
    }).session(session);
    const seller: IUser | null = await User.findOne({
      _id: offer.createdBy,
    }).session(session);
    if (!seller) {
      throw new Error("This offer has no trader to trade with.");
    }
    io.to(buyer?.socketID).emit("TRADE:ACCEPT");
    // EMIT PROGRESS FUNCTION
    const emitProgress = (num: number) => {
      io.to(buyer?.socketID).to(seller?.socketID).emit("TRADE:PROGRESS", num);
    };
    // EMIT PROGRESS
    emitProgress(0);
    io.to(buyer?.socketID)
      .to(seller?.socketID)
      .emit("TRADE:STATUS", "Checking items");
    emitProgress(5);

    // CHECK IF THE SELLER HAS THE ITEM
    const sellerItem = seller?.items?.find((item) => {
      return item.itemId.toString() === offer.itemOffering.toString();
    });
    if (!sellerItem) {
      throw new Error("Selling item does not exist");
    }
    emitProgress(10);

    // CHECK IF BUYER HAS THE ITEMS
    const filteredItems = offer.tradingItems.filter((item)=>{
      return item!==null
    })
    if(filteredItems.length){
      const buyerItems = filteredItems.every((item: IInventory) => {
        return buyer?.items?.some((buyerItem) => {
          return (
            item.itemId.toString() === buyerItem.itemId.toString() && item.count <= buyerItem.count
          );
        });
      });
      if (!buyerItems) {
        throw new Error("Buyer does not have every item that was offered");
      }
    }
    emitProgress(15);
    if (buyer?.coins! < offer.coins) {
      throw new Error("Buyer does not have enough coins to trade");
    }
    emitProgress(20);

    req.tradeData = {offer, buyer, seller, sellerItem,session,emitProgress, filteredItems}
    return next();
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json(error);
  }
};
