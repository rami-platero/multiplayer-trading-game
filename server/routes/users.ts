import {Router} from 'express'
import { Login, SignUp } from '../controllers/user.controller'

export const userRouter: Router = Router()

userRouter.post("/login", Login)
userRouter.post("/signup", SignUp)