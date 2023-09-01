import "./App.css";
import { useContext, useRef,} from "react";
import AuthScreen from "./components/Auth/AuthScreen";
import { userContext } from "./context/UserContext";
import { IGameState } from "./interfaces/interfaces";
import MainGame from "./components/Game/MainGame";
import { CSSTransition } from "react-transition-group";
import Shop from "./components/Shop/Shop";
import useScaleContainer from "./hooks/useScaleContainer";
import LobbySelector from "./components/Lobby Selector/LobbySelector";
import Lobby from "./components/Lobby/Lobby";
import { transitionContext } from "./context/transitionContext";
import ErrorModal from "./components/UI/ErrorModal";
import LoadingScreen from "./components/UI/LoadingScreen";
import axios from "axios";
import { API_URL } from "./config/config";

const App = () => {
  const { user, gameState, errorMessage, socket, authDispatch, loading } =
    useContext(userContext);
  const screenRef = useRef<HTMLDivElement>(null);(false);
  const containerRef = useScaleContainer(1600);
  const { selectorTimeout } = useContext(transitionContext);
  axios.defaults.baseURL = API_URL


  socket?.off("TRADE:UPDATE-ITEMS").on("TRADE:UPDATE-ITEMS", (items) => {
    authDispatch({ type: "UPDATE_INVENTORY", payload: items });
  });

  socket?.off("TRADE:UPDATE-COINS").on("TRADE:UPDATE-COINS", (coins) => {
    authDispatch({ type: "UPDATE_COINS", payload: coins });
  });

  return (
    <>
      <div
        className="game-parent"
        ref={containerRef}
      >
        <div className="main-game-wrapper" ref={screenRef}>
          {loading && <LoadingScreen />}
          {!user && gameState == IGameState.Auth && <AuthScreen />}
          <CSSTransition
            in={errorMessage !== null}
            timeout={300}
            unmountOnExit
            classNames={"grow"}
          >
            <ErrorModal />
          </CSSTransition>
          <CSSTransition
            in={gameState === IGameState.Main}
            timeout={300}
            classNames="slide"
            key={"slide"}
            unmountOnExit
          >
            <MainGame />
          </CSSTransition>
          <CSSTransition
            in={gameState === IGameState.Shop}
            timeout={300}
            classNames="slide"
            unmountOnExit
          >
            <Shop />
          </CSSTransition>
          <CSSTransition
            in={gameState == IGameState.Selector}
            timeout={selectorTimeout}
            classNames={"slide2"}
            unmountOnExit
          >
            <LobbySelector />
          </CSSTransition>
          {gameState == IGameState.Lobby && <Lobby />}
        </div>
      </div>
    </>
  );
};

export default App;
