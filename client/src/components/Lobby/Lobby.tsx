import Chat from "./Chat/Chat";
import Offers from "./Offers/Offers";
import OnlineMembers from "./OnlineMembers.tsx/OnlineMembers";
import BackBtn from "../UI/BackBtn";
import "./lobby.css";
import { useContext, useEffect } from "react";
import { userContext } from "../../context/UserContext";
import { lobbyContext } from "../../context/LobbyContext";

const Lobby = () => {

  const {socket, user} = useContext(userContext)
  const {lobby, lobbyDispatch} = useContext(lobbyContext)

  const handleLeaveLobby = ()=>{
    socket?.emit('leave-lobby', {user,lobby: lobby?.name})
    lobbyDispatch({type: "LEAVE"})
  }
  
  return (
    <div className="lobby-container">
      <div className="lobby-top-elements">
        <h1>Lobby {lobby?.name}</h1>
        <BackBtn handleEvents={handleLeaveLobby}/>
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
