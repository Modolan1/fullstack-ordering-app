import express from "express"
import { getCurrentUser, guestLogin, loginUser, registerUser } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/guest", guestLogin)
userRouter.get("/me", authMiddleware, getCurrentUser)

export default userRouter