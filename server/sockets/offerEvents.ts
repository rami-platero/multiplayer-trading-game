import { Socket, Server as SocketServer } from "socket.io";
import Room from "../models/Room";
import { IUser } from "../models/User";
import { Item } from "../models/Item";
import Trade, { IOffer, ITrade, Status } from "../models/Trade";
import { ICurrentLobby } from "./socket";

export const offerEvents = (io:SocketServer ,socket:Socket, currentLobby: ICurrentLobby)=>{
    socket.on("new-offer", async (obj) => {
        const { item, user }: { item: Item; user: IUser } = obj;
  
        const newTrade: ITrade = await new Trade({
          itemOffering: item._id,
          createdBy: user._id,
          status: Status.Open,
        }).save();
  
        const updatedOffers = await Room.newOffer(newTrade._id, currentLobby.value);
        io.to(currentLobby.value).emit("send-new-offer", updatedOffers);
      });
  
      socket.on("close-offer", async (itemID) => {
        const trade = await Trade.findOne({ itemOffering: itemID });
        await Trade.deleteOne({ itemOffering: itemID });
        await Room.updateOne(
          { name: currentLobby.value },
          {
            $pull: {
              offers: trade?._id,
            },
          }
        );
        socket.to(currentLobby.value).emit("remove-offer", itemID);
      });
  
      socket.on("USER:OPEN_OFFER", async (obj) => {
        const { offer, user }: { offer: IOffer; user: IUser } = obj;
        const exists = await Trade.findOne({_id:offer._id})
        if(!exists){
          io.to(user.socketID).emit("ERROR:OPENING-OFFER")
        } else {
          const {socketID, username, _id, roles, skin, ...rest} = user
          await Trade.updateOne(
            { _id: offer._id },
            {
              $set: {
                status: Status.Locked,
                tradingWith: user._id,
                coins: 0,
                tradingItems: [null,null,null,null,null,null]
              },
            }
            );
            io.to(offer.createdBy.socketID).emit('new-trader', {socketID, username, _id, roles, skin})
            io.to(currentLobby.value).emit("lock-offer", {
              ...offer,
              status: Status.Locked,
              tradingWith: user,
            });
        }
        });
  
      socket.on("USER:CLOSE_TRADE", async (offer:IOffer) => {
        if(offer._id){
          console.log("closes trade")
          await Trade.updateOne({_id: offer._id},{
            "status": Status.Open,
            $unset: {
              tradingWith: 1
            }
          })
          io.to(offer.createdBy.socketID).emit('trader-leaves')
          io.to(currentLobby.value).emit('unlock-offer', offer._id)
        }
      })
}