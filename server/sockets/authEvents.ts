import { Socket } from "socket.io";
import { ConnectedUsers, ErrorType, ModalProps } from "./socket";
import Item from "../models/Item";

interface Props {
  connectedSockets: ConnectedUsers;
  socket: Socket;
  modalError: ({ message, to, type }: ModalProps) => void;
}

export const authEvents = ({connectedSockets, socket, modalError}:Props) => {
  socket.on("login", async (username: string) => {
    if (connectedSockets[username]) {
      modalError({
        message: "You got disconnected because someone else logged in with your account credentials.",
        to: connectedSockets[username].id,
        type: ErrorType.DuplicateLogin
    });
    }
    connectedSockets[username] = socket;
    const Shopitems = await Item.find()
    const filteredItems = Shopitems.filter((item=>{
      return item.type==="premium"
    }))
    socket.emit("SERVER:SEND-SHOP-ITEMS",filteredItems)
  });

  socket.on("logout", (username: string) => {
    delete connectedSockets[username];
  });
};
