import { userContext } from "../../context/UserContext";
import {
  TransitionFrom,
  transitionContext,
} from "../../context/transitionContext";
import "./LobbySelector.css";
import { IGameState } from "../../interfaces/interfaces";
import { useContext, useState, useEffect } from "react";
import LobbyButton from "./LobbyButton";
import { btn_click_SFX, hover_btn_SFX } from "../SFX";
import { LobbyType } from "../../interfaces/interfaces";
import { lobbyContext } from "../../context/LobbyContext";
import Loader from "../../assets/loader.gif";

export interface LobbyCount {
  name: string;
  usersCount: number;
}

const VIPLobbies = ["A+", "B+", "C+", "D+", "E+"];
const NormalLobbies = ["A", "B", "C", "D", "E"];

const LobbySelector = () => {
  const { setGameState } = useContext(userContext);
  const { setChangeFrom } = useContext(transitionContext);
  const { loading } = useContext(lobbyContext);
  const [fromLobby, setFromLobby] = useState<boolean>(false);
  const [lobbies, setLobbies] = useState([]);
  const { socket } = useContext(userContext);

  const handleClickCloseBtn = () => {
    setGameState(IGameState.Main);
    setTimeout(() => {
      setChangeFrom(TransitionFrom.none);
    }, 400);
    btn_click_SFX.play();
  };

  useEffect(() => {
    socket?.emit("getLobbies");

    socket?.off("lobbiesInfo").on("lobbiesInfo", (lobbies) => {
      setLobbies(
        lobbies.sort((a: LobbyCount, b: LobbyCount) => {
          return a.name.localeCompare(b.name);
        })
      );
    });
  }, []);

  const getLobby = (name: string) => {
    return lobbies?.find((lobby: LobbyCount) => {
      return name == lobby.name;
    });
  };
  return (
    <div className={`lobby-selector-container ${fromLobby}`}>
      {loading && (
        <div className="loading-screen">
          <img className="loader" src={Loader} />
        </div>
      )}
      <h1 className="title">Lobby Selector</h1>
      <p className="description">
        Join a lobby to trade items with other users!
      </p>
      <hr />
      <div className="lobbies-container">
        <div className="normal-lobbies">
          <h3>Normal Lobbies</h3>
          {NormalLobbies.map((room) => {
            return (
              <LobbyButton
                key={room}
                room_name={room}
                type={LobbyType.normal}
                setFromLobby={setFromLobby}
                lobby={getLobby(room)}
              />
            );
          })}
        </div>
        <div className="vip-lobbies">
          <h3>VIP Lobbies</h3>
          {VIPLobbies.map((room) => {
            return (
              <LobbyButton
                key={room}
                room_name={room}
                type={LobbyType.VIP}
                setFromLobby={setFromLobby}
                lobby={getLobby(room)}
              />
            );
          })}
        </div>
      </div>
      <button
        className="close-btn"
        onMouseEnter={() => {
          hover_btn_SFX.play();
        }}
        onClick={handleClickCloseBtn}
      >
        Close
      </button>
    </div>
  );
};

export default LobbySelector;
