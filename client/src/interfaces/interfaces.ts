export enum GameState {
    Auth = 'auth',
    Selector = 'selector',
    Room = 'room'
}

export interface IUser {
    username: string;
    email: string;
    password: string;
    socketID: string;
    token: string;
  }