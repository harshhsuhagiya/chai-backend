import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
        try {
            const token=req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ","");
    
            if(!token){
                return new ApiError(401,"Unauthorized, Access token is missing");
            }
    
            const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
            const user=await User.findById(decodedToken?._id).select(" -password -refreshTokens")
            
            if(!user){
                return new ApiError(401,"Unauthorized, Invalid token");
            }
    
            req.user=user;
            next();
    
            
        } catch (error) {
            throw new ApiError(401,error?.message ||"Unauthorized, Invalid token");
        }
})