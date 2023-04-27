import Item from "../models/Item";
import Role from "../models/Role";
import { IItem, ISkin } from "../models/Item";
import { Types } from "mongoose";

export const createRoles = async (): Promise<void> => {
  const count: number = await Role.estimatedDocumentCount();

  if (count >= 2) return;

  try {
    const values = await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "admin" }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

export const getRole = async (): Promise<Types.ObjectId> => {
  const role = await Role.findOne({ name: "user" })
  return role?._id!
};

export const createItems = async (): Promise<void> => {
  const count: number = await Item.estimatedDocumentCount();
  if (count >= 3) return;

  try {
    const newItems = await Promise.all([
      new Item({
        name: "Claws",
        type: "rare",
        isSkin: false,
        image: "Claws.png",
      }).save(),
      new Item({
        name: "Anon",
        type: "rare",
        isSkin: false,
        image: "Anon.png",
      }).save(),
      new Item({
        name: "Dark-Skin",
        type: "rare",
        isSkin: true,
        skinData: {
          chatColor: "black",
          badgeColor: "black",
        },
        image: "Dark-Skin.png",
      }).save(),
    ]);
    console.log(newItems);
  } catch (error) {
    console.log(error);
  }
};

export const fetchItems = async (): Promise<IItem[]> => {
  const claws = await Item.findOne({ name: "Claws" }).select("_id");
  const anon = await Item.findOne({ name: "Anon" }).select("_id");
  const dark_skin = await Item.findOne({ name: "Dark-Skin" }).select("_id");

  return [
    { itemId: claws?._id, count: 1 },
    { itemId: anon?._id, count: 1 },
    { itemId: dark_skin?._id, count: 1 },
  ];
};

export interface IInitSetup {
  items: IItem[];
  skin: ISkin;
}

export const initUser = async (): Promise<IInitSetup> => {
  const itemsArray = await fetchItems();
  return {
    items: [...itemsArray],
    skin: {
      chatColor: "#cccccc",
      badgeColor: "#e0e0e0",
    },
  };
};
