import express,{Router} from "express"
import { add, lf, rf } from "../controllers/foodcontroller.js"
import multer  from "multer"

const foodRouter = Router();
//image storage
const storage =multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload =multer({storage:storage})

foodRouter.post("/add",upload.single("image"),add)
foodRouter.get("/list",lf)
foodRouter.post("/remove",rf)
export default foodRouter