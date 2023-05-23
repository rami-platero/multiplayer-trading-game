import Chat from "./Chat/Chat";
import Offers from "./Offers/Offers";
import OnlineMembers from "./OnlineMembers.tsx/OnlineMembers";
import BackBtn from "../UI/BackBtn";
import "./lobby.css";
import { useContext,useState } from "react";
import { userContext } from "../../context/UserContext";
import { OfferState, lobbyContext } from "../../context/LobbyContext";
import Offering from "./Offering/Offering";
import { CSSTransition } from "react-transition-group";
import TradingModal from "./TradingBox/TradingModal";
import { tradingContext } from "../../context/TradingContext";
import LobbyModal from "../UI/LobbyModal";
import TradeModal from "../UI/TradeModal";

const Lobby = () => {
  const { socket, user } = useContext(userContext);
  const { lobby, offerState, closeOffer, isTrading, currentTradeOffer } =
    useContext(lobbyContext);
  const { closeTrade, setTradeMessage,tradeMessage } = useContext(tradingContext);
  const [tradeAccept, setTradeAccept] = useState<boolean>(true)

  const handleLeaveLobby = () => {
    socket?.emit("leave-lobby", { _id: user!._id, lobby: lobby?.name });
    offerState == OfferState.Offering && closeOffer();
  };

  socket?.off("TRADE:REJECTED").on("TRADE:REJECTED", () => {
    setTradeMessage({
      username: currentTradeOffer?.createdBy.username,
      description: "rejected your offer.",
      reason: "Trade Rejected",
      dismissed: false
    });
    closeTrade();
  });

  socket?.off("ERROR:OPENING-OFFER").on("ERROR:OPENING-OFFER",()=>{
    setTradeMessage({
      description: "You can't open this offer because the seller already closed it.",
      reason: "Offer Error",
      dismissed: false
    })
    closeTrade()
  })

  socket?.off("TRADE:ACCEPT").on("TRADE:ACCEPT", ()=>{
    setTradeAccept(true)
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
      <CSSTransition
        in={tradeMessage?.dismissed === false}
        timeout={300}
        unmountOnExit
        classNames={"grow"}
      >
        <LobbyModal />
      </CSSTransition>
      <CSSTransition
        in={tradeAccept === true}
        timeout={300}
        unmountOnExit
        classNames={"trade"}
      >
        <TradeModal />
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
