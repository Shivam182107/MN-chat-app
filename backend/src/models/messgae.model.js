const mongoose=require("mongoose");
const messgaeSchema=new  mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    content:{type:String,trim:true},
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"chatModel"},
    readBy:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    
},{timestamps:true});
const messageModel=mongoose.model("messageModel",messgaeSchema);
 module.exports=messageModel;