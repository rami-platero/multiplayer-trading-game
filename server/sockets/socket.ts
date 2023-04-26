import { Server as SocketServer } from "socket.io";
import { server } from "../app";

export const initSocket = ()=>{
  const io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  
  io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}