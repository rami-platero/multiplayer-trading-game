import { ITradeData } from "./middlewares/checkTrade";

declare namespace Express {
    export interface Request {
        userId: string
    }
}

declare global {
    namespace Express {
      interface Request {
        tradeData?: ITradeData; 
      }
    }
  }