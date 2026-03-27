import orderModel from "../models/ordermode.js";
import userModel from "../models/usermodel.js";
import axios from "axios";

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // 🔹 Calculate items total
    const itemsTotal = req.body.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 🔹 Add delivery fee (like your tutor did with Stripe)
    const deliveryFee = 2000; // ₦2000 (you can change this)

    const totalAmount = itemsTotal + deliveryFee;

    // 🔹 Save order in DB
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: totalAmount,
      address: req.body.address,
      payment: false
    });

    await newOrder.save();

    // 🔹 Clear cart
    await userModel.findByIdAndUpdate(req.userId, {
      cartData: {}
    });

    // 🔹 Initialize Paystack payment
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.body.email, // MUST include
        amount: totalAmount * 100, // convert to kobo
        callback_url: `${frontend_url}/verify?orderId=${newOrder._id}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    // 🔹 Send payment link
    res.json({
      success: true,
      session_url: response.data.data.authorization_url,
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verify = async (req, res) => {
  try {
    const { orderId, reference } = req.body;

    if (!orderId || !reference) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    // 🔹 Call Paystack API to verify payment
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status === "success") {
      // ✅ Payment succeeded, update order
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        paystackReference: reference,
        paidAt: new Date(),
      });

      return res.json({ success: true, message: "Payment verified" });
    } else {
      // ❌ Payment failed, optionally delete order
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const usersOrder=  async (req,res)=>{
  try {
    const orders= await orderModel.find({userId:req.userId})
    res.json({success:true, data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
    
  }

}
 const listOrd = async(req,res)=>{
  try{
    const orders =await orderModel.find({})
    res.json({success:true, data:orders})
  }catch(err){
    res.json({success:false, message:"Error"})
  }

 }
 const up =async(req,res)=>{
  try{
await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
res.json({success:true, message:"Status Updated"})
  }
  catch(err){
    console.log(err);
    res.json({success:false, message:"Error"})
    

  }

 }
 const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }

    // Check if order exists
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Delete order
    await orderModel.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export {placeOrder,verify,usersOrder,listOrd,up,deleteOrder}