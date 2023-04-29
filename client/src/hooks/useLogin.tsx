import { useState, useContext } from "react";
import { IErrors, IForm } from "../components/Auth/useAuthForm";
import { userContext } from "../context/UserContext";

const useLogin = () => {
  const { authDispatch, socketID } = useContext(userContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (form: IForm,
    setErrors: React.Dispatch<React.SetStateAction<IErrors | null>>) => {
    setIsLoading(true);

    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({...form,socketID}),
    });
    const json = await res.json();

    if (!res.ok) {
      setIsLoading(false);
      setErrors(json.error)
    }

    if (res.ok) {
      setIsLoading(false);
      console.log(res)
      localStorage.setItem("user", JSON.stringify(json));

      authDispatch({type: "LOGIN", payload: json})
    }
  };

  return {login, isLoading}
};

export default useLogin;
