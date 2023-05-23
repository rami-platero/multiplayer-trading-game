import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import { IInventory } from "../models/Item";
import Trade from "../models/Trade";

export const tradeItems = async (req: Request, res: Response) => {
  const io = req.app.get("io");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { buyerName, sellerName, sellingItem, tradingItems, coins, room } =
      req.body;
  
    const buyer: IUser | null = await User.findOne({
      username: buyerName,
    }).session(session);
    const seller: IUser | null = await User.findOne({
      username: sellerName,
    }).session(session);

    const emitProgress = (num: number) => {
      io.to(buyer?.socketID).to(seller?.socketID).emit("TRADE:PROGRESS", num);
    };

    io.to(buyer?.socketID).to(seller?.socketID).emit("TRADE:ACCEPT");
    emitProgress(0);
    
    io.to(buyer?.socketID)
      .to(seller?.socketID)
      .emit("TRADE:STATUS", "Checking items");
    emitProgress(5);
    const sellerItem = seller?.items?.find((item) => {
      return item.itemId.toString() === sellingItem;
    });
    if (!sellerItem) {
      throw new Error("Selling item does not exist");
    }
    emitProgress(10);
    const buyerItems = tradingItems.every((item: IInventory) => {
      return buyer?.items?.some((it) => {
        return (
          item.itemId.toString() === it.itemId.toString() &&
          item.count <= it.count
        );
      });
    });
    if (!buyerItems) {
      throw new Error("Buyer does not have every item that was offered");
    }
    emitProgress(15);
    if (buyer?.coins! < coins) {
      throw new Error("Buyer does not have enough coins to trade");
    }
    emitProgress(20);
    io.to(buyer?.socketID)
      .to(seller?.socketID)
      .emit("TRADE:STATUS", "Completing transaction");
    await Trade.tradeCoins(sellerName, buyerName, coins, session);
    emitProgress(30);
    await Trade.removeItemFromSeller(
      sellerItem,
      sellerName,
      sellingItem,
      session
    );
    emitProgress(50);
    await Trade.addItemsToSeller(
      seller?.items!,
      tradingItems,
      sellerName,
      session
    );
    emitProgress(60);
    await Trade.removeItemsFromBuyer(tradingItems, buyer, session, buyerName);
    emitProgress(80);
    await Trade.addItemToBuyer(sellingItem, buyerName, buyer, session);
    emitProgress(90);

    
    await session.commitTransaction();
    session.endSession();
    // SOCKET EVENTS
    io.to(buyer?.socketID)
    .to(seller?.socketID)
    .emit("TRADE:STATUS", "Updating items");
    const buyerUpdated = await User.findOne({ username: buyerName }).populate(
      "items.itemId"
    );
    io.to(buyerUpdated?.socketID).emit(
      "TRADE:UPDATE-ITEMS",
      buyerUpdated?.items
    );
    const sellerUpdated = await User.findOne({ username: sellerName }).populate(
      "items.itemId"
    );
    io.to(sellerUpdated?.socketID).emit(
      "TRADE:UPDATE-ITEMS",
      sellerUpdated?.items
    );
    emitProgress(100);
    return res.status(200).json({ message: "Trade successful!" });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.log(error.message);
    return res.status(400).json(error);
  }
};
