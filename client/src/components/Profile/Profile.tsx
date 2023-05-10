import { SetStateAction } from "react";
import "./profile.css";
import { BiUser } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { IMainState } from "../Game/MainGame";
import { userContext } from "../../context/UserContext";
import { useContext } from "react";

interface props {
  setMainState: React.Dispatch<SetStateAction<IMainState | null>>;
}

const Profile = ({ setMainState }: props) => {
  const { user } = useContext(userContext);
  const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : '';
  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* <img src="https://wallpapercave.com/wp/wp6221066.jpg" /> */}
        <BiUser />
        <h2>{user?.username}</h2>
      </div>
      <div className="info-wrapper">
        <h3>
          Coins: <span>{user?.coins}</span>
        </h3>
        <h3>
          Account created: <span>{createdAt}</span>
        </h3>
        <h3>
          Unique Items: <span>{user?.items ? user.items.length : 0}</span>
        </h3>
        <button>Achievements</button>
      </div>
      <IoMdClose
        onClick={() => {
          setMainState(null);
        }}
      />
    </div>
  );
};

export default Profile;
