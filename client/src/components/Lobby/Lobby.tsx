import Chat from "./Chat/Chat";
import Offers from "./Offers/Offers";
import OnlineMembers from "./OnlineMembers.tsx/OnlineMembers";
import BackBtn from "../UI/BackBtn";
import "./lobby.css";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { OfferState, lobbyContext } from "../../context/LobbyContext";
import Offering from "./Offering/Offering";

const Lobby = () => {
  const { socket, user } = useContext(userContext);
  const { lobby, lobbyDispatch, offerState, closeOffer } = useContext(lobbyContext);

  const handleLeaveLobby = () => {
    socket?.emit("leave-lobby", { user, lobby: lobby?.name });
    offerState == OfferState.Offering && closeOffer()
    lobbyDispatch({ type: "LEAVE" });
  };

  socket?.off("send-new-offer").on("send-new-offer", (offers) => {
    console.log(offers)
    /* lobbyDispatch({ type: "OPEN_OFFER", payload: offers }); */
  });

  return (
    <div className="lobby-container">
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
