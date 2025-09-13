import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation check-not empty
    // check if user already exists: username, email
    // cheak for images,cheack for avatar
    // uplaod them to cloudinary
    // create user object- create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response



    const {fullname,email,username,password}=req.body;
    console.log("emial:",email);


    if(
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required");
    }

    // if(fullname ===""){    other way to handle error
    //     throw new ApiError(400,"Fullname is required"); 
    // }

    const existedUser=User.findOne({
        $or:[[{email}],[{username}]] 
    })
    if(existedUser){
        throw new ApiError(409,"User already exists with this email or username");
    }
    
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    const coverImagesLocalPath=req.files?.coverImages?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar File is required");
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImagesLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar File is required");
    }

    const user= await User.create({
        fullname,
        avatar: avatar.url,
        coverImages: coverImage?.url,
        email,
        username:username.TolowerCase(),
        password
    })

    const createdUser= await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered Successfully"
       )
    )
    
});


export {registerUser};