import { Socket, Server as SocketServer } from "socket.io";
import Room from "../models/Room";
import { IUser } from "../models/User";
import { ICurrentLobby } from "./socket";

export const lobbyEvents = (socket:Socket, currentLobby: ICurrentLobby) =>{
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
        currentLobby.value = lobby_name;
  
        const lobby = await Room.getLobby(lobby_name, user);
        socket.join(lobby_name);
        socket.emit("get-lobby", lobby);
        socket.broadcast.to(lobby_name).emit("user-joins", lobby.users);
      });
  
      socket.on("leave-lobby", async (obj) => {
        const { lobby, _id }: { lobby: string; _id: string } = obj;
        await Room.updateMany(
          { name: lobby },
          {
            $pull: {
              users: _id,
            },
          }
        );
  
        currentLobby.value = "";
        socket.leave(lobby);
        socket.broadcast.to(lobby).emit("user-leaves", _id);
      });
}