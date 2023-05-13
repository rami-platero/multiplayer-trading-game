import { Server as SocketServer } from "socket.io";
import { server } from "../app";
import Room from "../models/Room";
import User, { IUser } from "../models/User";
import { IRoom } from "../models/Room";
import { Item } from "../models/Item";
import Trade, { ITrade, Status } from "../models/Trade";

interface IChatMessage {
  username: string;
  message: string;
  chatColor: string;
}

export const initSocket = (): void => {
  const io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected");
    let currentLobby = "";

    socket.on("getLobbies", async () => {
      const lobbies = await Room.aggregate([
        {
          $project: {
            _id: 0,
            name: 1,
            usersCount: { $size: "$users" },
          },
        },
      ]);

      socket.emit("lobbiesInfo", lobbies);
    });

    socket.on("join-lobby", async (obj) => {
      const { lobby_name, user }: { lobby_name: string; user: IUser } = obj;
      currentLobby = lobby_name;

      const lobby = await Room.getLobby(lobby_name, user);
      socket.join(lobby_name);
      socket.emit("get-lobby", lobby);
      socket.broadcast.to(lobby_name).emit("user-joins", lobby.users);
    });

    socket.on("leave-lobby", async (obj) => {
      const { lobby, user }: { lobby: string; user: IUser } = obj;
      await Room.updateOne(
        { name: lobby },
        {
          $pull: {
            users: user._id,
          },
        }
      );

      currentLobby = "";
      socket.leave(lobby);
      socket.broadcast.to(lobby).emit("user-leaves", user._id);
    });

    socket.on("send-message", (obj) => {
      const {
        lobby_name,
        ...message
      }: { lobby_name: string; message: IChatMessage } = obj;
      socket.broadcast.to(lobby_name).emit("receive-message", message);
    });

    socket.on("change-skin", async (name) => {
      await User.updateOne(
        { socketID: socket.id },
        {
          $set: {
            "skin.chatColor": name,
            "skin.badgeColor": name,
          },
        },
        {
          new: true,
        }
      );
      socket.emit("changed-skin", name);
    });

    socket.on("new-offer", async (obj) => {
      const { item, user }: { item: Item; user: IUser } = obj;

      const newTrade: ITrade = await new Trade({
        itemTrading: item._id,
        createdBy: user._id,
        status: Status.Open,
      }).save();

      const Offers = await Room.findOneAndUpdate(
        { name: currentLobby },
        {
          $push: {
            offers: newTrade._id,
          },
        },
        {
          new: true,
        }
      )
        .populate({
          path: "offers",
          model: Trade,
          populate: {
            path: "createdBy tradingWith itemTrading",
          },
        })
        .select("offers");

      console.log(currentLobby);

      socket.emit("send-new-offer", Offers);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
