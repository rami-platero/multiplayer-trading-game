import { Server as SocketServer } from "socket.io";
import { server } from "../app";
import Room from "../models/Room";
import { IUser } from "../models/User";
import { IRoom } from "../models/Room";

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
      const { room_name, user }: { room_name: string; user: IUser } = obj;

      const room: IRoom | null = await Room.findOneAndUpdate(
        { name: room_name },
        {
          $push: {
            users: user._id,
          },
        },
        {
          new: true,
        }
      );
      socket.join(room_name);
      socket.emit("get-lobby", room);
    });

    socket.on("leave-lobby", async (obj) => {
      const { lobby, user }: { lobby: string; user: IUser } = obj;
      console.log("leaving Lobby");
      await Room.updateOne(
        { name: lobby },
        {
          $pull: {
            users: user._id,
          },
        }
      );
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
