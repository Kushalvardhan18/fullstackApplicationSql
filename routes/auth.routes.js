import { logInUser, registerUser, verifyUser } from "../controllers/auth.controller.js";

import express from "express"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",logInUser)
userRouter.get("/verify/:token",verifyUser)

export default userRouter