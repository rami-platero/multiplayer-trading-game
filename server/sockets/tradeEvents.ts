import { Server, Socket, Server as SocketServer } from "socket.io";

import Item, { IInventory } from "../models/Item";
import { IUser } from "../models/User";
import Trade, { IOffer, ITrade } from "../models/Trade";
import { Status } from "../models/Trade";
import { ICurrentLobby } from "./socket";

export const tradeEvents = (
  socket: Socket,
  io: Server,
  currentLobby: ICurrentLobby
) => {
  socket.on("TRADER:ADD-ITEM", async (obj) => {
    const {
      item,
      socketID,
      index,
      offerID,
    }: { item: typeof Item; socketID: string; index: number; offerID: string } =
      obj;
    io.to(socketID).emit("TRADE:ADD-ITEM", {
      item: {
        itemId: item,
        count: 1,
      },
      index,
    });
    const fieldPath = `tradingItems.${index}`;
    await Trade.updateOne(
      { _id: offerID },
      { $set: { [fieldPath]: { itemId:item, count: 1 } } }
    );
  });
  socket.on("TRADER:REMOVE-ITEM", async (obj) => {
    const { index, socketID, offerID }: { index: number; socketID: string, offerID: string } = obj;
    io.to(socketID).emit("TRADE:REMOVE-ITEM", index);
    const fieldPath = `tradingItems.${index}`;
    await Trade.updateOne(
      { _id: offerID },
      { $set: { [fieldPath]: null } }
    );
  });
  socket.on("TRADER:ADDS_ITEM_AMOUNT", async (obj) => {
    const { index, socketID, offerID }: { index: number; socketID: string, offerID: string } = obj;
    io.to(socketID).emit("TRADE:ADD_ITEM_AMOUNT", index);
    const fieldPath = `tradingItems.${index}.count`;
    await Trade.updateOne(
      { _id: offerID },
      { $inc: { [fieldPath]: 1} }
    );
  });
  socket.on("TRADER:LOCKS_OFFER", (socketID: string) => {
    io.to(socketID).emit("TRADE:LOCKED");
  });
  socket.on("SELLER:UNLOCKS_OFFER", (socketID: string) => {
    io.to(socketID).emit("TRADE:UNLOCKED");
  });
  socket.on("TRADER:LOCKS_COINS", async (obj) => {
    const { coins, socketID,offerID }: { coins: number; socketID: string, offerID: string } = obj;
    io.to(socketID).emit("TRADE:UPDATE_COINS", coins);
    await Trade.updateOne(
      { _id: offerID },
      { $set: { coins: coins} }
    );
  });
  socket.on("SELLER:REJECTS", async (obj) => {
    const { offerID, buyer }: { offerID: string; buyer: string } = obj;
    io.to(buyer).emit("TRADE:REJECTED");
    if (offerID) {
      await Trade.updateOne(
        { _id: offerID },
        {
          status: Status.Open,
          $unset: {
            tradingWith: 1,
          },
        }
      );
    }
    io.to(currentLobby.value).emit("unlock-offer", offerID);
  });
};
