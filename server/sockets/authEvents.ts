import { Socket } from "socket.io";
import { ConnectedUsers, ErrorType, ModalProps } from "./socket";

interface Props {
  connectedSockets: ConnectedUsers;
  socket: Socket;
  modalError: ({ message, to, type }: ModalProps) => void;
}

export const authEvents = ({connectedSockets, socket, modalError}:Props) => {
  socket.on("login", (username: string) => {
    if (connectedSockets[username]) {
      modalError({
        message: "You got disconnected because someone else logged in with your account credentials.",
        to: connectedSockets[username].id,
        type: ErrorType.DuplicateLogin
    });
    }
    connectedSockets[username] = socket;
  });

  socket.on("logout", (username: string) => {
    delete connectedSockets[username];
  });
};
