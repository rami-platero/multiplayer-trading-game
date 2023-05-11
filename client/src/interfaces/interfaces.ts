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
  coins: number;
  _id: string
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

export interface IOffer {
  _id: string
  room: string,
  createdBy: string,
  tradingWith?: string,
  status: Status,
  lockedBy?: string
}