import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });



const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // file has been uploaded
        //console.log("file uploaded on cloudinary !! :", response.url);
        fs.unlinkSync(localFilePath)
        return response;
        
    }
    catch(err){
        fs.unlinkSync(localFilePath)
        console.log("Error in uploading file on cloudinary !!", err);
        return null;
    }
}

export { uploadOnCloudinary }