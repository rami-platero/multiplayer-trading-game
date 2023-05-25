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
  const { lobby, offerState, closeOffer, isTrading, currentTradeOffer,lobbyDispatch } =
    useContext(lobbyContext);
  const { closeTrade, setTradeMessage,tradeMessage } = useContext(tradingContext);
  const [tradeAccept, setTradeAccept] = useState<boolean>(false)

  socket?.off("send-new-offer").on("send-new-offer", (offers) => {
    lobbyDispatch({ type: "MAKE_OFFER", payload: offers.offers });
  });

  socket?.off("remove-offer").on("remove-offer", (itemID) => {
    lobbyDispatch({ type: "REMOVE_OFFER", payload: itemID });
  });

  socket?.off("lock-offer").on("lock-offer", (offer) => {
    lobbyDispatch({ type: "LOCK_OFFER", payload: { ...offer } });
  });

  socket?.off("unlock-offer").on("unlock-offer", (ID) => {
    lobbyDispatch({ type: "UNLOCK_OFFER", payload: ID });
  });

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
    closeTrade()
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
        <TradeModal setTradeAccept={setTradeAccept}/>
      </CSSTransition>
      <div className="lobby-top-elements">
        <h1>Lobby {lobby?.name}</h1>
        <BackBtn handleEvents={handleLeaveLobby} />
      </div>
      <div className="lobby-wrapper">
        {offerState == OfferState.None && <Offers />}
        {offerState == OfferState.Offering && <Offering setAcceptTrade={setTradeAccept}/>}
        <OnlineMembers />
        <Chat />
      </div>
    </div>
  );
};

export default Lobby;
