import express,{Router} from "express"
import authMiddleware from "../middleware/auth.js";
import { addCart,rv,getCart } from "../controllers/cartcontroller.js"

const CartRouter =Router();
CartRouter.post("/add",authMiddleware, addCart)
CartRouter.post("/remove" ,authMiddleware,rv)
CartRouter.post("/get",authMiddleware,getCart)
export  default CartRouter