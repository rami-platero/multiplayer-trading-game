import io from "socket.io-client";
import "./App.css";

const App = () => {
  const socket = io("http://localhost:4000");

  /* socket.on("connect", () => {
    console.log(socket?.id);
  }); */

  return <>

  </>
}

export default App;

{
  /* <div className="game-parent">
  <div className="offers"></div>
  <div className="online"></div>
  <div className="chat"></div>
</div> */
}
