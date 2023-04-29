import { useState } from "react";
import { userContext } from "../../context/UserContext";
import useSignUp from "../../hooks/useSignUp";
import useLogin from "../../hooks/useLogin";

export interface IForm {
  username: string;
  password: string;
  email?: string;
}

export interface IErrors {
  username?: string;
  password?: string;
  email?: string;
}

enum authType {
  LOGIN="LOGIN",
  SIGNUP="SIGN_UP"
}

const useAuthForm = (initialState: IForm) => {
  const [form, setForm] = useState<IForm>(initialState);
  const [errors, setErrors] = useState<IErrors | null>(null);
  let objErrors:IErrors = {}
  const {signup} = useSignUp()
  const {login} = useLogin()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if(errors!=null && errors.hasOwnProperty(name) && value.trim()){
      delete (errors as any)[name]
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>,isSignUp:boolean):Promise<void> => {
    e.preventDefault();
    validate();
    if(Object.keys(objErrors).length === 0){
      isSignUp && await signup(form,setErrors)
      !isSignUp && await login(form,setErrors)
    }
  };

  const validate = () => {
    for (const [key] of Object.entries(form)) {
      if (!(form as any)[key].trim()) {
        (objErrors as any)[key] = "Field must be filled"
        setErrors(objErrors);
      }
    }
  };

  return { handleChange, handleSubmit, errors };
};

export default useAuthForm;
