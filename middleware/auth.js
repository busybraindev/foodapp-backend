import jwt from "jsonwebtoken";
const authMiddleware =async(req,res,next)=>{
    const {token}=req.headers;
    if(!token){
        return res.json({success:false,message:"Not authorized"})
    }
    try{
        const td =jwt.verify(token,process.env.JWT_SECRET);
        req.userId = td.id;
         req.user= td;
         console.log(req.user);
         
        next()
    }
    catch(err){
        console.log(err);
        res.json({success:false, message:"ERROR"})
        
    }

}
export default authMiddleware