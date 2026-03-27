import mongoose from "mongoose";

export const connectDB=async() =>{
    await mongoose.connect('mongodb+srv://busybraindev:adigun06@cluster1.odcrmmj.mongodb.net/food-del').then(()=>{
        console.log("DB connected");
        
    })
}