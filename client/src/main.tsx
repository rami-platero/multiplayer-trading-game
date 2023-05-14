import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserContextProvider } from "./context/UserContext.tsx";
import TransitionContextProvider from "./context/transitionContext.tsx";
import TradingContextProvider from "./context/TradingContext.tsx";
import LobbyContextProvider from "./context/LobbyContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <UserContextProvider>
    <LobbyContextProvider>
      <TradingContextProvider>
        <TransitionContextProvider>
          <App />
        </TransitionContextProvider>
      </TradingContextProvider>
    </LobbyContextProvider>
  </UserContextProvider>
);
