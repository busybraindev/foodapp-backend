import userModel from "../models/usermodel.js"
const addCart = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.userId });
    let cartData = user.cartData;

    cartData[req.body.itemId] = req.body.quantity; // ✅ USE FRONTEND VALUE
    console.log(req.body.itemId,req.body.quantity);
    

    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true ,message:"Added" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

const rv = async (req, res) => {
  try {
    let data = await userModel.findById(req.userId);
    let cartData = data.cartData;

    const itemId = req.body.itemId;

    if (!cartData[itemId]) {
      return res.json({ success: false, message: "Item not in cart" });
    }

    // decrease quantity
    cartData[itemId] -= 1;

    // if quantity becomes 0 → delete item
    if (cartData[itemId] <= 0) {
      delete cartData[itemId]; // 🔥 important
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
};
const getCart=async(req,res)=>{
    try{
        let data =await userModel.findById(req.userId);
        let cartData=await data.cartData;
        res.json({success:true, cartData})
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"ERROR"})
        
    }

}
export {addCart,rv,getCart}