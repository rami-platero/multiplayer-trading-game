import { useState } from "react";
import "./auth.css";
import Login from "./Login";
import Register from "./Register";

enum AuthState {
  Login = "Login",
  Register = "Register",
}

const AuthScreen = () => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.Login);

  return (
    <div className="auth-container">
      <h1>Welcome!</h1>
      <div className="auth-selector">
        <h3
          className={`title ${authState === "Register"}`}
          onClick={() => {
            setAuthState(AuthState.Register);
          }}
        >
          Sign Up
        </h3>
        <h3 className={`title ${authState === "Login"}`}  onClick={() => {
            setAuthState(AuthState.Login);
          }}>Login</h3>
      </div>
      {authState === "Login" && <Login />}
      {authState === "Register" && <Register />}
    </div>
  );
};

export default AuthScreen;
