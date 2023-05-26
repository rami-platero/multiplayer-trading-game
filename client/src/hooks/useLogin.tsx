import {  useContext } from "react";
import { IErrors, IForm } from "../components/Auth/useAuthForm";
import { userContext } from "../context/UserContext";
import { IGameState } from "../interfaces/interfaces";

const useLogin = () => {
  const { authDispatch, socketID,setGameState,socket,setLoading } = useContext(userContext);

  const login = async (form: IForm,
    setErrors: React.Dispatch<React.SetStateAction<IErrors | null>>) => {
    setLoading(true);

    const res = await fetch("https://trading-game.onrender.com/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({...form,socketID}),
    });
    const json = await res.json();

    if (!res.ok) {
      setLoading(false);
      setErrors(json.error)
    }

    if (res.ok) {
      setLoading(false);
      localStorage.setItem("user", JSON.stringify(json));
      socket?.emit('login', json?.username)
      authDispatch({type: "LOGIN", payload: json})
      setGameState(IGameState.Main)
    }
  };

  return {login}
};

export default useLogin;
