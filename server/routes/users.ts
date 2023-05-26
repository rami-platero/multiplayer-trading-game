import {Router} from 'express'
import { Login, SignUp, buyItem, removeItem } from '../controllers/user.controller'

export const userRouter: Router = Router()

userRouter.post("/login", Login)
userRouter.post("/signup", SignUp)
userRouter.post("/buyItem/:id", buyItem)
userRouter.post("/removeItem/:id", removeItem)