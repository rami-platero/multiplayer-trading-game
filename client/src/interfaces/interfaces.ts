export interface ContextProps {
  children: JSX.Element | JSX.Element[];
}

export enum IGameState {
  Auth = "auth",
  Main = "main",
  Lobby = "lobby",
  Shop = "shop",
  Selector = "selector"
}

export interface ISkin {
  chatColor: string;
  badgeColor: string;
}

/* export interface UserItem{
  count: number,
  itemId: Item
} */

export interface Item {
  name: string;
  type: string;
  isSkin: boolean;
  skinData?: ISkin;
  image: string;
  _id: string;
  price?: number
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
  coins: number;
  _id: string
  isVIP: boolean
}

export interface IUserinLobby{
  _id: string;
  username: string;
  socketID: string;
  skin: ISkin;
  roles: IRole[];
}

export interface Lobby {
  name: string
  /* users: IUserinLobby[] */
  /* offers: IOffer[] */
  type: LobbyType 
}

export enum LobbyType{
  normal="normal",
  VIP="VIP"
}

export enum Status {
  Open = "open",
  Locked = "locked"
}

export interface ICreatedBy{
  _id: string,
  username: string,
  socketID: string
}

export interface IOffer {
  _id: string,
  itemOffering: Item
  createdBy: ICreatedBy,
  tradingWith?: IUser,
  status: Status,
}