import { BiUser } from "react-icons/bi";
import "./lobby_btn.css";
import { LobbyType } from "./RoomSelector";
import { AiFillLock } from "react-icons/ai";
import { hover_btn_SFX } from "../SFX";
import { useState, SetStateAction } from "react";
import LobbyModal from "./LobbyModal";
import { userContext } from "../../context/UserContext";
import { useContext } from "react";
import { IGameState } from "../../interfaces/interfaces";

interface Props {
  room_name: string;
  type: LobbyType;
  setFromLobby: React.Dispatch<SetStateAction<boolean>>;
}

function LobbyButton({ room_name, type, setFromLobby }: Props) {
  const { setGameState } = useContext(userContext);
  const isVIP: boolean = false;
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const handleLobby = (): void => {
    setFromLobby(true);
    setGameState(IGameState.Lobby);
  };

  return (
    <>
      {/* {modalIsOpen && <LobbyModal />} */}
      <button
        className={`${isVIP}`}
        onMouseEnter={() => {
          hover_btn_SFX.play();
        }}
        disabled={type == LobbyType.VIP && !isVIP ? true : false}
        onClick={() => {
          /* setModalIsOpen(true) */
          handleLobby();
        }}
      >
        {!isVIP && type == LobbyType.VIP && <AiFillLock />}
        <p>Lobby {room_name}</p>
        <p className="users-amount">
          <BiUser />0
        </p>
      </button>
    </>
  );
}

export default LobbyButton;
