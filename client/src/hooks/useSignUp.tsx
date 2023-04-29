import { useState, useContext } from "react";
import useAuthForm, { IErrors, IForm } from "../components/Auth/useAuthForm";
import { userContext } from "../context/UserContext";

const useSignUp = () => {
  const { authDispatch, socketID } = useContext(userContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signup = async (
    form: IForm,
    setErrors: React.Dispatch<React.SetStateAction<IErrors | null>>
  ) => {
    setIsLoading(true);

    const res = await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...form, socketID }),
    });
    const json = await res.json();

    if (!res.ok) {
      setIsLoading(false);
      setErrors(json.error);
      console.log(json.error);
    }

    if (res.ok) {
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify(json));
      authDispatch({ type: "LOGIN", payload: json });
    }
  };

  return { signup, isLoading };
};

export default useSignUp;
