import mongoose from "mongoose";

const subcriptionSchema= new mongoose.Schema(
    {
        subscriber:{
            type: mongoose.Schema.Types.ObjectId, // one who is subscribing
            ref:"User"
        },
        channel:{
            type: mongoose.Schema.Types.ObjectId, // one to whom 'subscriber' is subacribing
            ref:"User"
        }
    }
    ,{timestamps:true})


export const Subcription= mongoose.model("Subcription",subcriptionSchema)