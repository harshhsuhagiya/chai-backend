import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema= new mongoose.Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type: String,
            required:true,
            trim:true,
            index:true,
        },
        avtar:{
            type: String, // using cloudinary url
            required:true,
        },
        coverImage:{
            type: String, // using cloudinary url
        },
        watchHistory:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Video",
            }
        ],
        password:{
            type: String,
            required:[true,'Password is required'],
            unique:true,
        },
        refreshToken:{
            type: String,
        },
    }
    ,{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.modified("password")) return next();

    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
     {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRES,
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
     return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRES,
        }
    )
}

export const User=mongoose.model("User",userSchema);