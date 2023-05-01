import "./App.css";
import { useState, useContext, useRef } from "react";
import AuthScreen from "./components/Auth/AuthScreen";
import { userContext } from "./context/UserContext";
import { IGameState } from "./interfaces/interfaces";
import MainGame from "./components/Game/MainGame";
import { CSSTransition } from "react-transition-group";
import Shop from "./components/Shop/Shop";

const App = () => {
  const { user, gameState, setGameState } = useContext(userContext);
  const screenRef = useRef<HTMLDivElement>(null);
  const handleFullscreen = () => {
    screenRef.current!.requestFullscreen();
    /*     if (!document.fullscreenElement) {
    } else {
      document.exitFullscreen();
    } */
  };

  return (
    <div className="game-parent">
      <button onClick={handleFullscreen}>full screen</button>
      <div className="main-game-wrapper" ref={screenRef}>
        <div className="flex-container">
        {!user && gameState == IGameState.Auth && <AuthScreen />}
        {/* {gameState == IGameState.Main && <MainGame />} */}
        {/* {gameState == IGameState.Shop && <Shop/>} */}
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
        </div>
      </div>
    </div>
  );
};

export default App;

{
  /* <div className="game-parent">
  <div className="offers"></div>
  <div className="online"></div>
  <div className="chat"></div>
</div> */
}
