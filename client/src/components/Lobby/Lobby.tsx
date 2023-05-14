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

enum TradingState {
  Trading = "trading",
}

const Lobby = () => {
  const { socket, user } = useContext(userContext);
  const { lobby, lobbyDispatch, offerState, closeOffer, isTrading } =
    useContext(lobbyContext);

  const handleLeaveLobby = () => {
    socket?.emit("leave-lobby", { user, lobby: lobby?.name });
    offerState == OfferState.Offering && closeOffer();
    lobbyDispatch({ type: "LEAVE" });
  };

  socket?.off("send-new-offer").on("send-new-offer", (offers) => {
    lobbyDispatch({ type: "MAKE_OFFER", payload: offers.offers });
  });

  socket?.off("remove-offer").on("remove-offer", (itemID) => {
    lobbyDispatch({ type: "REMOVE_OFFER", payload: itemID });
  });

  socket?.off("lock-offer").on("lock-offer", (offer) => {
    lobbyDispatch({ type: "LOCK_OFFER", payload: { ...offer } });
  });

  socket?.off('unlock-offer').on('unlock-offer', ID => {
    console.log("unlock offer")
    lobbyDispatch({type:"UNLOCK_OFFER",payload: ID})
  })

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
