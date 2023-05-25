import { Request, Response } from "express";
import User from "../models/User";
import Trade from "../models/Trade";
import { ITradeData } from "../middlewares/checkTrade";

interface MyParams {
  offerID: string;
}

export const tradeItems = async (req: Request<MyParams>, res: Response) => {
  const io = req.app.get("io");
  const {
    offer,
    buyer,
    seller,
    sellerItem,
    session,
    emitProgress,
    filteredItems,
  }: ITradeData = req.tradeData!;
  try {
    io.to(buyer?.socketID)
      .to(seller?.socketID)
      .emit("TRADE:STATUS", "Completing transaction");
    if (offer?.coins! > 1) {
      await Trade.tradeCoins(
        seller?.username!,
        buyer?.username!,
        offer?.coins!,
        session
      );
    }
    emitProgress(30);
    await Trade.removeItemFromSeller(
      sellerItem,
      seller?.username!,
      offer?.itemOffering.toString()!,
      session
    );
    emitProgress(50);
    if (filteredItems.length) {
      await Trade.addItemsToSeller(seller, filteredItems, session);
      emitProgress(60);
      await Trade.removeItemsFromBuyer(filteredItems, buyer, session);
    }
    emitProgress(80);
    await Trade.addItemToBuyer(offer?.itemOffering.toString()!, buyer, session);
    emitProgress(90);

    await session.commitTransaction();
    session.endSession();
    // UPDATE USERS
    io.to(buyer?.socketID)
      .to(seller?.socketID)
      .emit("TRADE:STATUS", "Updating items");
    const buyerUpdated = await User.findOne({
      username: buyer?.username,
    }).populate("items.itemId");
    io.to(buyerUpdated?.socketID).emit(
      "TRADE:UPDATE-ITEMS",
      buyerUpdated?.items
    );
    io.to(buyerUpdated?.socketID).emit(
      "TRADE:UPDATE-COINS",
      buyerUpdated?.coins
    );
    const sellerUpdated = await User.findOne({
      username: seller?.username,
    }).populate("items.itemId");
    io.to(sellerUpdated?.socketID).emit(
      "TRADE:UPDATE-ITEMS",
      sellerUpdated?.items
    );
    io.to(sellerUpdated?.socketID).emit(
      "TRADE:UPDATE-COINS",
      sellerUpdated?.coins
    );
    emitProgress(100);
    return res.status(200).json({ message: "Trade successful!" });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json(error);
  }
};
