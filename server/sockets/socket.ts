import { Socket, Server as SocketServer } from "socket.io";
import { server } from "../app";
import Room from "../models/Room";
import User from "../models/User";
import { offerEvents } from "./offerEvents";
import { chatEvents } from "./chatEvents";
import { lobbyEvents } from "./lobbyEvents";
import { authEvents } from "./authEvents";

export interface ConnectedUsers {
  [username: string]: Socket;
}

export interface ModalProps {
  message: string;
  to: string;
  type: ErrorType;
}

export enum ErrorType {
  DuplicateLogin = "duplicate login",
}

export interface ICurrentLobby{
  value: string
}

export const initSocket = (): void => {
  const connectedSockets: ConnectedUsers = {};

  const io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected");
    const modalError = ({ message, to, type }: ModalProps): void => {
      io.to(to).emit("error", { message, type });
    };
    let currentLobby:ICurrentLobby = {value: ""};

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
    authEvents({connectedSockets,modalError,socket})
    lobbyEvents(socket, currentLobby);
    chatEvents(socket);
    offerEvents(io, socket, currentLobby);

    socket.on("disconnect", async () => {
      if (currentLobby) {
        socket.leave(currentLobby.value);
        const user = await User.findOne({ socketID: socket.id });
        await Room.updateOne(
          { name: currentLobby.value },
          {
            $pull: {
              users: user?._id,
            },
          }
        );
      }
      for (const key in connectedSockets) {
        if (connectedSockets[key].id === socket.id) {
          delete connectedSockets[key];
        }
      }
      console.log("user disconnected");
    });
  });
};
