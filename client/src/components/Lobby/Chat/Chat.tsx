import { useContext, useState, useEffect, useRef } from "react";
import "./chat.css";
import "./chat_styles.css";
import { lobbyContext } from "../../../context/LobbyContext";
import { userContext } from "../../../context/UserContext";
import { tradingContext } from "../../../context/TradingContext";
import { tick_SFX } from "../../SFX";

interface IMessage {
  username?: string;
  message: string;
  chatColor: string;
  special?: boolean;
  isAdmin?: boolean;
}

const Chat = () => {
  const { lobby, currentTradeOffer } = useContext(lobbyContext);
  const { socket, user,isAdmin } = useContext(userContext);
  const { tradingWith } = useContext(tradingContext);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inPrivateChat, setInPrivateChat] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      if (inPrivateChat && tradingWith) {
        socket?.emit("send-private-message", {
          username: user?.username,
          message,
          chatColor: user?.skin.chatColor,
          lobby_name: lobby?.name,
          to: tradingWith.socketID,
          isAdmin,
        });
      }
      if (inPrivateChat && currentTradeOffer) {
        socket?.emit("send-private-message", {
          username: user?.username,
          message,
          chatColor: user?.skin.chatColor,
          lobby_name: lobby?.name,
          to: currentTradeOffer.createdBy.socketID,
          isAdmin,
        });
      }
      if (!inPrivateChat) {
        socket?.emit("send-message", {
          username: user?.username,
          message,
          chatColor: user?.skin.chatColor,
          lobby_name: lobby?.name,
          isAdmin,
        });
      }
      tick_SFX.play();
      setMessage("");
      setMessages([
        ...messages,
        {
          username: user!.username,
          message,
          chatColor: user!.skin.chatColor,
          isAdmin: isAdmin,
        },
      ]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  socket?.off("receive-message").on("receive-message", (message) => {
    if (!inPrivateChat) {
      tick_SFX.play();
      setMessages([...messages, message]);
    }
  });

  socket
    ?.off("receive-private-message")
    .on("receive-private-message", (message) => {
      tick_SFX.play();
      setMessages([...messages, message]);
    });

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
      <div className="messages" ref={chatContainerRef}>
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
                  <p className={msg.isAdmin === true ? "VIP" : ""}>
                    {" "}
                    {msg.message}
                  </p>
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
