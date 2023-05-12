import { Server as SocketServer } from "socket.io";
import { server } from "../app";
import Room from "../models/Room";
import User, { IUser } from "../models/User";
import { IRoom } from "../models/Room";

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

    socket.on('change-skin', async name=>{
      await User.updateOne({socketID: socket.id}, {$set: {
        "skin.chatColor": name,
        "skin.badgeColor": name
      }},{
        new: true
      })
      socket.emit("changed-skin", name)
    })

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
