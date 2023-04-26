import React, { useEffect } from "react";
import io from "socket.io-client";

const App = () => {
  const socket = io("http://localhost:4000");
  useEffect(()=>{
    socket.on("user:connect", console.log("new user connected"))

    return (()=>{
      socket.off("user:disconnect", console.log("new user connected"))
    })
  },[])
  
  return <div>App</div>;
};

export default App;
