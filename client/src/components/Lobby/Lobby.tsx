import Chat from "./Chat/Chat";
import Offers from "./Offers/Offers";
import OnlineMembers from "./OnlineMembers.tsx/OnlineMembers";
import BackBtn from "../UI/BackBtn";
import "./lobby.css";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { OfferState, lobbyContext } from "../../context/LobbyContext";
import Offering from "./Offering/Offering";
import { CSSTransition } from "react-transition-group";
import TradingModal from "./TradingBox/TradingModal";

const Lobby = () => {
  const { socket, user } = useContext(userContext);
  const { lobby, offerState, closeOffer, isTrading } =
    useContext(lobbyContext);

  const handleLeaveLobby = () => {
    socket?.emit("leave-lobby", { _id: user!._id, lobby: lobby?.name });
    offerState == OfferState.Offering && closeOffer();
  };

  return (
    <div className="lobby-container">
      <CSSTransition
        in={isTrading == true}
        timeout={300}
        unmountOnExit
        classNames={"grow"}
      >
        <TradingModal />
      </CSSTransition>
      <div className="lobby-top-elements">
        <h1>Lobby {lobby?.name}</h1>
        <BackBtn handleEvents={handleLeaveLobby} />
      </div>
      <div className="lobby-wrapper">
        {offerState == OfferState.None && <Offers />}
        {offerState == OfferState.Offering && <Offering />}
        <OnlineMembers />
        <Chat />
      </div>
    </div>
  );
};

export default Lobby;
