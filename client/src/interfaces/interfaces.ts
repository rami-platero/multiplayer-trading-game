export interface contextProps {
  children: JSX.Element | JSX.Element[];
}

export enum IGameState {
  Auth = "auth",
  Main = "main",
  Room = "room",
  Shop = "shop"
}

export interface ISkin {
  chatColor: string;
  badgeColor: string;
}

export interface Item {
  name: string;
  type: string;
  isSkin: boolean;
  skinData?: ISkin;
  image: string;
}

export interface IInventory {
  itemId: Item;
  count: number;
}

export interface IRole {
    name: string;
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  socketID: string;
  token: string;
  items: IInventory[];
  skin: ISkin;
  roles: IRole[];
  createdAt: Date;
}
