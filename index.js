import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodroute.js";
import CartRouter from "./routes/cartroutes.js";
import UserRouter from "./routes/userroute.js";
import "dotenv/config"
import orderRouter from "./routes/orderroutes.js";
import authMiddleware from "./middleware/auth.js";
// app config
const app =express();
const port = 4000;

//middleware
app.use(express.json());
app.use(cors())
app.get("/api/user/verify", authMiddleware, (req, res) => {
  res.json({
    success: true,
    role: req.user.role,
  });
});

connectDB()
//api endpoints
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use('/api/user',UserRouter)
app.use('/api/cart', CartRouter)
app.use("/api/order",orderRouter)
app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost: ${port}`);
    
})