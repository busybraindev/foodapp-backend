import mongoose, {Schema} from "mongoose"

const UserSchema =new Schema({
    name:{
        type:String,
        required:true
    },
    email:{type: String, required:true, unique:true},
    password:{type:String, required:true},
    cartData:{type:Object,default:{}},
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
},
},{minimize:false})
const userModel =mongoose.models.user || mongoose.model("user",UserSchema)
export default userModel;