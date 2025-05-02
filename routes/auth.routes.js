import { forgotPassword, getProfile, logInUser, logOut, registerUser, resetPassword, verifyUser } from "../controllers/auth.controller.js";

import express from "express"
import { isLoggedIn } from "../middleWare/auth.middleware.js";

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", logInUser)
userRouter.get("/verify/:token", verifyUser)
userRouter.get("/profile",isLoggedIn, getProfile)
userRouter.get("/logout",isLoggedIn, logOut)
userRouter.get("/forgotpassword", forgotPassword)
userRouter.get("/resetpassword", resetPassword)

export default userRouter