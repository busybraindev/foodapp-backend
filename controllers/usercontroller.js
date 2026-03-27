import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator";


const Login = async(req,res)=>{
const {email,password}=req.body;
try{
    const user =await userModel.findOne({email})
    console.log(user);
    
    if(!user){
       return  res.json({success:false, message: "User doesn't exist"})
    }
    const isMatch =await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.json({success:false, message:"Invalid Credential"})
    }
    const token =Ctoken(user._id, user.role)
   res.json({
  success: true,
  token,
  user: {
    id: user._id,
    role: user.role
  }
});
}
catch(err){
    console.log(err);
    res.json({success:false, message: "Error"})
    
}

}
const Ctoken =(id,role)=>{
return jwt.sign({id,role},process.env.JWT_SECRET)
}
const Reg =async(req,res)=>{
    const {name,password,email}=req.body;
    try{
     const exists =await userModel.findOne({email})
     
     
     if(exists){
        res.json({success:false,message:"User already exists"})
     }
     //validating email and password
     if(!validator.isEmail(email)){
        return res.json({success:false, message:"Enter a Valid Email!!"})
     }
     if(password.length<8){
        return res.json({success:false, message:"Please Enter a Strong password"})
     }
     const salt =await bcrypt.genSalt(10)
     const Hp =await bcrypt.hash(password,salt)
     const newUser = new userModel({
        name:name,
        email:email,
        password:Hp
     })
    const user=  await newUser.save();
    const token =Ctoken(user._id, user.role)
    res.json({success:true, token,
      user: {
    id: user._id,
    role: user.role
  }
    })
    }
    catch(err){
  console.log(err);
  res.json({success:false, message: "Error"})
  
    }
}
export {Login,Reg}