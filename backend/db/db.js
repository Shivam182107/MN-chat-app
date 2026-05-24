const mongoose=require("mongoose")


async function connectDb(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/chatdb");
    await mongoose.connect(process.env.DB_URL);

}
module.exports=connectDb