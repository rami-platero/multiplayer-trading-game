import { Socket, Server as SocketServer } from "socket.io";

export const chatEvents = (socket:Socket,io:SocketServer)=>{

    interface IChatMessage {
        username: string;
        message: string;
        chatColor: string;
        isAdmin: boolean
      }

    socket.on("send-message", (obj) => {
        const {
          lobby_name,
          ...message
        }: { lobby_name: string; message: IChatMessage } = obj;
        socket.broadcast.to(lobby_name).emit("receive-message", message);
      });

    socket.on("send-private-message", obj=>{
      const {to,...message}:{to:string,message:IChatMessage} = obj
      io.to(to).emit("receive-private-message", message)
    }) 

}