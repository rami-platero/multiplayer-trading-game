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
import {
  TransitionFrom,
  transitionContext,
} from "../../context/transitionContext";
import { CSSTransition } from "react-transition-group";
import Coins from "../UI/Coins";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { btn_click_SFX, hover_btn_SFX } from "../SFX";

export enum IMainState {
  Profile = "profile",
  Inventory = "inventory",
}

const MainGame = () => {
  const { user, setGameState } = useContext(userContext);
  const { changeFrom, setChangeFrom } = useContext(transitionContext);
  const { logout } = useLogOut();
  const [mainState, setMainState] = useState<IMainState | null>(null);

  const handleClickMarketplace = (): void => {
    setChangeFrom(TransitionFrom.selector);
    setGameState(IGameState.Selector);
    btn_click_SFX.play();
  };

  return (
    <div className={`game-container ${changeFrom}`}>
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
        <div className="buttons">
          <button
            onClick={handleClickMarketplace}
            onMouseEnter={() => {
              hover_btn_SFX.play();
            }}
          >
            <FaUsers />
            MARKETPLACE
          </button>
          <button
            onMouseEnter={() => {
              hover_btn_SFX.play();
            }}
            onClick={() => {
              btn_click_SFX.play();
            }}
          >
            <BsFillBoxFill />
            INVENTORY
          </button>
          <button
            onMouseEnter={() => {
              hover_btn_SFX.play();
            }}
            className="shop-btn"
            onClick={() => {
              setGameState(IGameState.Shop);
              btn_click_SFX.play();
            }}
          >
            <RiShoppingCart2Fill />
            SHOP
          </button>
          <button
            onMouseEnter={() => {
              hover_btn_SFX.play();
            }}
            onClick={() => {
              btn_click_SFX.play();
            }}
            className="friends-btn"
          >
            <FaUserFriends />
            FRIENDS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainGame;
