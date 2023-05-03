import { userContext } from "../../context/UserContext";
import {
  TransitionFrom,
  transitionContext,
} from "../../context/transitionContext";
import { IGameState } from "../../interfaces/interfaces";
import "./RoomSelector.css";
import { useContext,useState } from "react";
import LobbyButton from "./LobbyButton";
import {hover_btn_SFX} from '../SFX'

export enum LobbyType{
  normal="normal",
  VIP="VIP"
}

const VIPLobbies = ["A+","B+","C+","D+","E+"]
const NormalLobbies = ["A","B","C","D","E"]

const RoomSelector = () => {
  const { setGameState } = useContext(userContext);
  const { setChangeFrom } = useContext(transitionContext);
  const [fromLobby, setFromLobby] = useState<boolean>(false)

  return (
    <div className={`lobby-selector-container ${fromLobby}`}>
      <h1 className="title">Lobby Selector</h1>
      <p className="description">Join a lobby to trade items with other users!</p>
      <hr />
      <div className="lobbies-container">
      <div className="normal-lobbies">
        <h3>Normal Lobbies</h3>
        {NormalLobbies.map((room)=>{
          return <LobbyButton room_name={room} type={LobbyType.normal} setFromLobby={setFromLobby}/>
        })}
      </div>
      <div className="vip-lobbies">
      <h3>VIP Lobbies</h3>
        {VIPLobbies.map((room)=>{
          return <LobbyButton room_name={room} type={LobbyType.VIP} setFromLobby={setFromLobby}/>
        })}
      </div>
      </div>
      <button
        className="close-btn"
        onMouseEnter={()=>{
          hover_btn_SFX.play()
        }}
        onClick={() => {
          setGameState(IGameState.Main);
          setTimeout(() => {
            setChangeFrom(TransitionFrom.none);
          }, 400);
        }}
      >
        Close
      </button>
    </div>
  );
};

export default RoomSelector;
