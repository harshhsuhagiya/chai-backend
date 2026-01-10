import mongoose from "mongoose";

const tweerSchema = new mongoose.Schema(
    {
        content:{
            type: String,
            required:true,
        },
        owner:{
            type: mongoose.Types.ObjectId,
            ref:"User",
            require:true
        }
    }
    ,{timestamps:true}
);

export const Tweet = mongoose.model("Tweet",tweerSchema)