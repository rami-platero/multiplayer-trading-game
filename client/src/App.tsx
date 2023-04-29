import "./App.css";
import { useState, useContext } from "react";
import { GameState } from "./interfaces/interfaces";
import AuthScreen from "./components/Auth/AuthScreen";
import { userContext } from "./context/UserContext";

const App = () => {
  const [gameState, setgameState] = useState<GameState>(GameState.Auth);
  const { user } = useContext(userContext);
  /* socket.on("connect", () => {
    console.log(socket?.id);
  }); */

  return <div className="game-parent">
    {!user && <AuthScreen />}
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
