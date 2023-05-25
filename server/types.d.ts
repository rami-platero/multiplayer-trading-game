import { ITradeData } from "./middlewares/checkTrade";

declare global {
    namespace Express {
      interface Request {
        tradeData?: ITradeData; 
        userId?: string
      }
    }
  }