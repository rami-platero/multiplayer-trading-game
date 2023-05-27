import { useContext, useState, useEffect } from "react";
import "./chat.css";
import "./chat_styles.css";
import { lobbyContext } from "../../../context/LobbyContext";
import { userContext } from "../../../context/UserContext";
import {  tradingContext } from "../../../context/TradingContext";

interface IMessage {
  username?: string;
  message: string;
  chatColor: string;
  special?: boolean;
}

const Chat = () => {
  const { lobby, currentTradeOffer } = useContext(lobbyContext);
  const { socket, user } = useContext(userContext);
  const {  tradingWith } = useContext(tradingContext);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inPrivateChat, setInPrivateChat] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      if(inPrivateChat && tradingWith){
        socket?.emit("send-private-message", {
          username: user?.username,
          message,
          chatColor: user?.skin.chatColor,
          lobby_name: lobby?.name,
          to: tradingWith.socketID
        });
      }
      if(inPrivateChat && currentTradeOffer){
        socket?.emit("send-private-message", {
          username: user?.username,
          message,
          chatColor: user?.skin.chatColor,
          lobby_name: lobby?.name,
          to: currentTradeOffer.createdBy.socketID
        });
      }
      if(!inPrivateChat){
        socket?.emit("send-message", {
          username: user?.username,
          message,
          chatColor: user?.skin.chatColor,
          lobby_name: lobby?.name,
        });
      }
      setMessage("");
      setMessages([
        ...messages,
        { username: user!.username, message, chatColor: user!.skin.chatColor },
      ]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  socket?.off("receive-message").on("receive-message", (message) => {
    if(!inPrivateChat){
      setMessages([...messages, message]);
    }
  });

  socket?.off("receive-private-message").on("receive-private-message", message =>{
    setMessages([...messages, message]);
  })

  const setPrivateMessages = () => {
    tradingWith &&
      setMessages([
        {
          message: `You are now in a private room with ${tradingWith?.username}`,
          chatColor: "#0fa7ff",
          special: true,
        },
      ]);
    currentTradeOffer &&
      setMessages([
        {
          message: `You are now in a private room with ${currentTradeOffer?.createdBy.username}`,
          chatColor: "#0fa7ff",
          special: true,
        },
      ]);
  };

  useEffect(() => {
    if (tradingWith || currentTradeOffer) {
      setInPrivateChat(true);
    } else {
      setMessages([]);
      setInPrivateChat(false);
    }
    setPrivateMessages();
  }, [currentTradeOffer, tradingWith]);

  return (
    <div className="chat-container">
      <div className="messages">
        {!inPrivateChat && (
          <p className="welcome-message">Welcome to Lobby {lobby?.name}</p>
        )}
        {messages.map((msg) => {
          const key = `${new Date().toISOString()}-${Math.random()}`;
          return (
            <div className="message" key={key}>
              {msg.special ? (
                <>
                  <span
                    className={`chat-skin ${msg.chatColor}`}
                    style={{ color: msg.chatColor }}
                  >
                    {msg.message}
                  </span>
                </>
              ) : (
                <>
                  <span
                    className={`chat-skin ${msg.chatColor}`}
                    style={{ color: msg.chatColor }}
                  >
                    {msg.username}:
                  </span>
                  <p className={`${msg.username}`}> {msg.message}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoComplete="off"
          value={message}
          spellCheck={false}
          onChange={handleChange}
          placeholder="Send a message..."
        />
      </form>
    </div>
  );
};

export default Chat;
