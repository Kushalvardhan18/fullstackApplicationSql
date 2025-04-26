import { logInUser, registerUser } from "../controllers/auth.controller.js";

import express from "express"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",logInUser)

export default userRouter