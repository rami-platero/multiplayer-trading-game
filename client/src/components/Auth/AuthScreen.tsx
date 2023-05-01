import { useState,useEffect,useRef } from "react";
import "./auth.css";
import Login from "./Login";
import Register from "./Register";
import useScaleContainer from '../../hooks/useScaleContainer'

enum AuthState {
  Login = "Login",
  Register = "Register",
}

const AuthScreen = () => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.Login);
  const containerRef = useScaleContainer(1408);

  return (
    <div className="main-auth">
      <div className="auth-container" ref={containerRef}>
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
          <h3
            className={`title ${authState === "Login"}`}
            onClick={() => {
              setAuthState(AuthState.Login);
            }}
          >
            Login
          </h3>
        </div>
        {authState === "Login" && <Login />}
        {authState === "Register" && <Register />}
      </div>
    </div>
  );
};

export default AuthScreen;
