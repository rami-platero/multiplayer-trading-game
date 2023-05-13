import { useContext, useState } from "react";
import "./chat.css";
import './chat_styles.css'
import { lobbyContext } from "../../../context/LobbyContext";
import { userContext } from "../../../context/UserContext";

interface IMessage {
  username: string;
  message: string;
  chatColor: string;
}

const Chat = () => {
  const { lobby } = useContext(lobbyContext);
  const { socket, user } = useContext(userContext);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      socket?.emit("send-message", {
        username: user?.username,
        message,
        chatColor: user?.skin.chatColor,
        lobby_name: lobby?.name
      });
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

  socket?.off('receive-message').on('receive-message', message => {
    setMessages([...messages, message])
  })


  return (
    <div className="chat-container">
      <div className="messages">
        <p className="welcome-message">Welcome to Lobby {lobby?.name}</p>
        {messages.map((msg) => {
          const key = `${new Date().toISOString()}-${Math.random()}`;
          return (
            <div className="message" key={key}>
              <span className={`chat-skin ${user?.skin.chatColor}`} style={{ color: msg.chatColor }}>
                {msg.username}:
              </span>
              <p> {msg.message}</p>
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
