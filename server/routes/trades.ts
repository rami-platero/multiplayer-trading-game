import {Router} from 'express'
import { tradeItems } from '../controllers/trade.controller'
/* import { verifyToken } from '../middlewares/verifyUser' */
import { checkTrade } from '../middlewares/checkTrade'

export const tradeRouter: Router = Router()

tradeRouter.post("/trade/:offerID", checkTrade,tradeItems)