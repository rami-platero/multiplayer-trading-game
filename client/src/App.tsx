import io from "socket.io-client";
import "./App.css";
import { useState } from "react";
import { GameState } from "./interfaces/interfaces";
import AuthScreen from "./components/Auth/AuthScreen";

const App = () => {
  const [gameState, setgameState] = useState<GameState>(GameState.Auth);
  const socket = io("http://localhost:4000");

  /* socket.on("connect", () => {
    console.log(socket?.id);
  }); */

  return <div className="game-parent">
    <AuthScreen />
  </div>;
};

export default App;

{
  /* <div className="game-parent">
  <div className="offers"></div>
  <div className="online"></div>
  <div className="chat"></div>
</div> */
}
