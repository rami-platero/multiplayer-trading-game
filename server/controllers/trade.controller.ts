import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import { IInventory } from "../models/Item";
import Trade, { IOffer, ITrade } from "../models/Trade";

interface MyParams {
  offerID: string
}

export const tradeItems = async (req: Request<MyParams>, res: Response) => {
  try{
    console.log(req.tradeData)
    /* 
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
    return res.status(200).json({ message: "Trade successful!" }); */
    return res.status(200).json({ message: "Trade successful!" });
  } catch (error: any) {
    return res.status(400).json(error);
    /* await session.abortTransaction();
    session.endSession();
    console.log(error.message);
    return res.status(400).json(error); */
  }
}
