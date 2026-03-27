import express, { Router } from "express"
import { Login,Reg } from "../controllers/usercontroller.js"

const UserRouter =Router()
UserRouter.post("/register",Reg)
UserRouter.post("/login", Login)
export default UserRouter