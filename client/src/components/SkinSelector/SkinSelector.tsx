import { Toaster, toast } from "react-hot-toast";
import { userContext } from "../../context/UserContext";
import "./skin_selector.css";
import { useContext, useState } from "react";
import { IoMdClose } from "react-icons/io";

const globalSkins = [
  "red",
  "blue",
  "greenyellow",
  "yellow",
  "deeppink",
  "gray",
  "aqua",
];

interface Props {
  handleState: () => void;
}

const SkinSelector = ({ handleState }: Props) => {
  const { user, socket, authDispatch } = useContext(userContext);
  const [currentSkin, setCurrentSkin] = useState(user?.skin.badgeColor);

  socket?.off("changed-skin").on("changed-skin", (newSkin) => {
    authDispatch({ type: "CHANGE_SKIN", payload: newSkin });
  });

  const filteredItems = user?.items.filter((item) => {
    return item.itemId.isSkin;
  });

  const handleSkin = (name: string) => {
    if (name != currentSkin) {
      toast.success("Skin changed!");
      setCurrentSkin(name);
      socket?.emit("change-skin", name);
    }
  };

  return (
    <div className="skin-selector-container">
      <div className="header">
        <div className="top-elements">
          <h2>Your Skins</h2>
          <button onClick={handleState} className="close-btn">
            <IoMdClose />
          </button>
        </div>
        <p>
          Here you can change your skin! The appearance will be reflected in the
          game lobby when you chat with users and in the online members box!
        </p>
      </div>
      <div className="global-skins-container">
        <h2>Global Skins</h2>
        <div className="skins-wrapper">
          {globalSkins.map((name) => {
            return (
              <div
                className={`skin`}
                onClick={() => {
                  handleSkin(name);
                }}
                style={{
                  backgroundColor: name,
                  border: currentSkin == name ? "2px solid white" : "0px",
                }}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="owned-skins-container">
        <h2>Owned Skins</h2>
        <div className="skins-wrapper">
          {filteredItems?.map((item) => {
            return (
              <div
                className={`skin ${item.itemId.name}`}
                onClick={() => {
                  handleSkin(item.itemId.name);
                }}
                style={{
                  border:
                    currentSkin == item.itemId.name ? "2px solid white" : "0px",
                }}
              >
                <img src={item.itemId.image} />
              </div>
            );
          })}
        </div>
      </div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#0f0f0f",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default SkinSelector;
