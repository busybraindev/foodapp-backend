import foodModel from "../models/foodmodel.js";
import fs from "fs"

const add =async(req,res)=>{
    let image_filename=`${req.file.filename}`
    const food =new foodModel({
        name: req.body.name,
        description:req.body.description,
        price: req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try{
        await food.save()
        res.json({sucess:true,message:"Food Added"})
    }
    catch(err){
        console.log(err);
        res.json({success:false, message: "Error"})
        
    }
}
// food Lists
const lf =async(req,res)=>{
    try{
        const foods=await foodModel.find({})
        res.json({sucess:true,data:foods})
    }
    catch(err){
        console.log(err);
        res.json({sucess:false, message:"error"})
        
    }

}
const rf =async(req,res)=>{
    try{
        const food=await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Food Removed"})
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"Failed"})
        

    }
}
export {add,lf,rf}