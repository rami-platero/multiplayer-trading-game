import { lobbyContext } from "../../../context/LobbyContext";
import { userContext } from "../../../context/UserContext";
import "./OnlineMembers.css";
import './onlineMembers_styles.css'
import { useContext, useEffect } from "react";

const OnlineMembers = () => {
  const { lobbyUsers, lobbyDispatch } = useContext(lobbyContext);
  const { socket } = useContext(userContext);

  useEffect(() => {
    socket?.off("user-joins").on("user-joins", (newUsers) => {
      lobbyDispatch({ type: "USER:JOINS", payload: newUsers });
    });

    socket?.off("user-leaves").on("user-leaves", (id) => {
      lobbyDispatch({ type: "USER:LEAVES", payload: id });
    });
  }, []);

  return (
    <div className="online-members-container">
      <div className="title">
        <h3>Online Users</h3>
      </div>
      <div className="members-box">
        {lobbyUsers?.map((user) => {
          return (
            <div
              key={user._id}
              className={`member-badge-box ${user.skin.badgeColor}`}
              style={{ background: user.skin.badgeColor }}
            >
              <p>{user.username}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnlineMembers;
