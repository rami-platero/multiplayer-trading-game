import "./chat.css";

const Chat = () => {
  return (
    <div className="chat-container">
      <div className="messages">
        <div className="message">
          <span className="chat-skin">Inzanic:</span>
          <p> Yo, what's poppin</p>
        </div>
        <div className="message">
          <span className="chat-skin">Inzanic:</span>
          <p> Yo, what's poppin</p>
        </div>
      </div>
      <input
        type="text"
        autoComplete="off"
        spellCheck={false}
        placeholder="Send a message..."
      />
    </div>
  );
};

export default Chat;
