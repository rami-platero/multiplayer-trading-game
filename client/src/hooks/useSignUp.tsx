import { useContext } from "react";
import { IErrors, IForm } from "../components/Auth/useAuthForm";
import { userContext } from "../context/UserContext";
import { IGameState } from "../interfaces/interfaces";
import { API_URL } from "../config/config";
import useToast from "./useToast";

const useSignUp = () => {
  const { authDispatch, socketID,setGameState,setLoading,socket } = useContext(userContext);
  const {notifyError} = useToast()

  const signup = async (
    form: IForm,
    setErrors: React.Dispatch<React.SetStateAction<IErrors | null>>
  ) => {
    setLoading(true);
    try{
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...form, socketID }),
      });
      const json = await res.json();
  
      if (!res.ok) {
        setLoading(false);
        setErrors(json);
        console.log(json);
      }
  
      if (res.ok) {
        setLoading(false);
        localStorage.setItem("user", JSON.stringify(json));
        socket?.emit('login', json?.username)
        authDispatch({ type: "LOGIN", payload: json });
        setGameState(IGameState.Main)
      }

  } catch (error) {
    if (error instanceof Error) {
      notifyError("Server is starting, please try again in a minute.");
    }
  } finally{
    setLoading(false);
  }
  };

  return { signup };
};

export default useSignUp;
