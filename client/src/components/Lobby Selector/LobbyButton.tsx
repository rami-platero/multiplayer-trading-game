import { BiUser } from "react-icons/bi";
import "./lobby_btn.css";
import { LobbyCount } from "./LobbySelector";
import { AiFillLock } from "react-icons/ai";
import { hover_btn_SFX } from "../SFX";
import {  SetStateAction } from "react";
import { userContext } from "../../context/UserContext";
import { useContext} from "react";
import { IGameState } from "../../interfaces/interfaces";
import { transitionContext } from "../../context/transitionContext";
import { LobbyType } from "../../interfaces/interfaces";
import { lobbyContext } from "../../context/LobbyContext";

interface Props {
  room_name: string;
  type: LobbyType;
  setFromLobby: React.Dispatch<SetStateAction<boolean>>;
  lobby?: LobbyCount;
}

function LobbyButton({ room_name, type, lobby, setFromLobby }: Props) {
  const { lobbyDispatch} = useContext(lobbyContext);
  const { setGameState, socket, user,setLoading } = useContext(userContext);
  const { setSelectorTimeout } = useContext(transitionContext);
  /* const [modalIsOpen, setModalIsOpen] = useState<boolean>(false); */

  const handleLobby = (): void => {
    setLoading(true)
    socket?.emit("join-lobby", { lobby_name: room_name, user });
  };

  //on joining lobby
  socket?.off("get-lobby").on("get-lobby", (room) => {
    lobbyDispatch({ type: "JOIN", payload: room });
    setSelectorTimeout(0);
    setFromLobby(true);
    setGameState(IGameState.Lobby);
    setLoading(false)
  });

  return (
    <>
      {/* {modalIsOpen && <LobbyModal />} */}
      <button
        className={`${user?.isVIP}`}
        onMouseEnter={() => {
          hover_btn_SFX.play();
        }}
        disabled={type == LobbyType.VIP && !user?.isVIP ? true : false}
        onClick={handleLobby}
      >
        {!user?.isVIP && type == LobbyType.VIP && <AiFillLock />}
        <p>Lobby {room_name}</p>
        <p className="users-amount">
          <BiUser />
          {lobby ? lobby.usersCount : 0}
        </p>
      </button>
    </>
  );
}

export default LobbyButton;
