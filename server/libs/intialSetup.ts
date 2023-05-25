import Item from "../models/Item";
import Role from "../models/Role";
import { IInventory, ISkin } from "../models/Item";
import { Types } from "mongoose";
import Room, { RoomType } from "../models/Room";

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
  const role = await Role.findOne({ name: "user" });
  return role?._id!;
};

export const createItems = async (): Promise<void> => {
  /* const count: number = await Item.estimatedDocumentCount();
  if (count >= 3) return; */

  try {
    const newItems = await Promise.all([
      new Item({
        name: "Fireman",
        type: "premium",
        isSkin: false,
        image: "Fireman.png",
      }).save(),
      new Item({
        name: "Blue Bandana",
        type: "premium",
        isSkin: false,
        image: "Blue Bandana.png",
      }).save(),
      new Item({
        name: "Biohazard",
        type: "premium",
        isSkin: true,
        skinData: {
          chatColor: "#dcffc9",
          badgeColor: "#dcffc9",
        },
        image: "Biohazard.png",
      }).save(),
    ]);
    console.log(newItems);
  } catch (error) {
    console.log(error);
  }
};

export const fetchItems = async (): Promise<IInventory[]> => {
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
  items: IInventory[];
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

export const createRooms = async (): Promise<void> => {
  const count: number = await Room.estimatedDocumentCount();

  try {
    if (count < 10) {
      await Promise.all([
        new Room({
          name: "A",
          type: RoomType.Normal,
        }).save(),
        new Room({
          name: "B",
          type: RoomType.Normal,
        }).save(),
        new Room({
          name: "C",
          type: RoomType.Normal,
        }).save(),
        new Room({
          name: "D",
          type: RoomType.Normal,
        }).save(),
        new Room({
          name: "E",
          type: RoomType.Normal,
        }).save(),
        new Room({
          name: "A+",
          type: RoomType.VIP,
        }).save(),
        new Room({
          name: "B+",
          type: RoomType.VIP,
        }).save(),
        new Room({
          name: "C+",
          type: RoomType.VIP,
        }).save(),
        new Room({
          name: "D+",
          type: RoomType.VIP,
        }).save(),
        new Room({
          name: "E+",
          type: RoomType.VIP,
        }).save(),
      ]);
    } else {
      console.log("Rooms already exist");
    }
  } catch (error) {
    console.log(error);
  }
};
