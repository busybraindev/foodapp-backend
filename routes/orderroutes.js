import express,{Router} from "express"
import authMiddleware from "../middleware/auth.js"
import { listOrd, placeOrder,up,usersOrder,verify,deleteOrder } from "../controllers/ordercontroller.js"

const orderRouter=Router()
orderRouter.post('/place',authMiddleware,placeOrder)
orderRouter.post('/verify',verify)
orderRouter.post('/usersorder',authMiddleware,usersOrder)
orderRouter.get('/list',listOrd)
orderRouter.post('/status',up)
orderRouter.post("/delete", authMiddleware, deleteOrder);

export default orderRouter;