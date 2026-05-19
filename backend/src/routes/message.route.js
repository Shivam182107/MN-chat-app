const express=require("express");
const { checkUserAuth } = require("../middlewares/auth.middleware");
const messageController = require("../controllers/message.controller");
const messageRouter=express.Router();

messageRouter.post("/",checkUserAuth,messageController.sendMessage);
messageRouter.get("/:chatId",checkUserAuth,messageController.allMessages);

module.exports=messageRouter