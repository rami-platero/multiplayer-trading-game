import "./game.css";
import "./transitions.css";
import { BsFillBoxFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import useLogOut from "../../hooks/useLogout";
import Profile from "../Profile/Profile";
import { IGameState } from "../../interfaces/interfaces";
import { transitionContext } from "../../context/transitionContext";
import { CSSTransition } from "react-transition-group";
import Coins from "../UI/Coins";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import RoomSelector from "./RoomSelector";

export enum IMainState {
  Profile = "profile",
  Inventory = "inventory",
  Marketplace = "marketplace",
}

const MainGame = () => {
  const { user, setGameState } = useContext(userContext);
  const { fromShop } = useContext(transitionContext);
  const { logout } = useLogOut();
  const [mainState, setMainState] = useState<IMainState | null>(null);

  return (
    <div className={`game-container ${fromShop}`}>
      <Coins style={{ left: "0" }} />
      <div className="profile-actions">
        <button
          onClick={() => {
            setMainState(IMainState.Profile);
          }}
        >
          <BiUser />
          {user?.username}
        </button>
        <button onClick={logout}>Log Out</button>
      </div>
      <span className="version">Version: 0.0.0</span>
      <div className="game-content">
        <CSSTransition
          in={mainState == IMainState.Profile}
          timeout={200}
          classNames={"grow"}
          unmountOnExit
        >
          <Profile setMainState={setMainState} />
        </CSSTransition>
        <CSSTransition
          in={mainState == IMainState.Marketplace}
          timeout={200}
          classNames={"grow"}
          unmountOnExit
        >
          <RoomSelector setMainState={setMainState} />
        </CSSTransition>
        <div className="buttons">
          <button onClick={() => {
            setMainState(IMainState.Marketplace)
          }}>
            <FaUsers />
            MARKETPLACE
          </button>
          <button>
            <BsFillBoxFill />
            INVENTORY
          </button>
          <button
            className="shop-btn"
            onClick={() => {
              setGameState(IGameState.Shop);
            }}
          >
            <RiShoppingCart2Fill />
            SHOP
          </button>
          <button className="friends-btn">
            <FaUserFriends />
            FRIENDS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainGame;
