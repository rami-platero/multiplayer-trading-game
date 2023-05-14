import { Socket, Server as SocketServer } from "socket.io";
import Room from "../models/Room";
import { IUser } from "../models/User";

export const chatEvents = (socket:Socket)=>{

    interface IChatMessage {
        username: string;
        message: string;
        chatColor: string;
      }

    socket.on("send-message", (obj) => {
        const {
          lobby_name,
          ...message
        }: { lobby_name: string; message: IChatMessage } = obj;
        socket.broadcast.to(lobby_name).emit("receive-message", message);
      });

}