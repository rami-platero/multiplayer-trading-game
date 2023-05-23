import {Router} from 'express'
import { tradeItems } from '../controllers/trade.controller'
import { verifyToken } from '../middlewares/verifyUser'

export const tradeRouter: Router = Router()

tradeRouter.post("/trade", [/* verifyToken, */tradeItems])