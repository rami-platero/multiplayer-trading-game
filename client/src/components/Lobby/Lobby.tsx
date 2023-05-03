import Chat from "../Chat/Chat";
import Offers from "../Offers/Offers";
import OnlineMembers from "../OnlineMembers.tsx/OnlineMembers";
import BackBtn from "../UI/BackBtn";
import "./lobby.css";

const Lobby = () => {
  return (
    <div className="lobby-container">
      <div className="lobby-top-elements">
        <BackBtn />
      </div>
      <div className="lobby-wrapper">
        <Offers />
        <OnlineMembers />
        <Chat />
      </div>
    </div>
  );
};

export default Lobby;
