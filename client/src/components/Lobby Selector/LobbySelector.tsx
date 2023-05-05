import { userContext } from "../../context/UserContext";
import {
  TransitionFrom,
  transitionContext,
} from "../../context/transitionContext";
import './LobbySelector.css'
import { IGameState } from "../../interfaces/interfaces";
import { useContext,useState } from "react";
import LobbyButton from "./LobbyButton";
import {btn_click_SFX, hover_btn_SFX} from '../SFX'

export enum LobbyType{
  normal="normal",
  VIP="VIP"
}

const VIPLobbies = ["A+","B+","C+","D+","E+"]
const NormalLobbies = ["A","B","C","D","E"]

const LobbySelector = () => {
  const { setGameState } = useContext(userContext);
  const { setChangeFrom } = useContext(transitionContext);
  const [fromLobby, setFromLobby] = useState<boolean>(false)

  const handleClickCloseBtn = ()=>{
    setGameState(IGameState.Main);
    setTimeout(() => {
      setChangeFrom(TransitionFrom.none);
    }, 400);
    btn_click_SFX.play()
  }

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
        onClick={handleClickCloseBtn}
      >
        Close
      </button>
    </div>
  );
};

export default LobbySelector;
