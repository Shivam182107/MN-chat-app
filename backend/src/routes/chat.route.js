const express=require("express");
const chatController = require("../controllers/chat.controller");
const { checkUserAuth } = require("../middlewares/auth.middleware");
const chatrouter=express.Router();
chatrouter.post("/",checkUserAuth,chatController.accesPrivateChat);
chatrouter.get("/",checkUserAuth,chatController.fecthAllChat);
chatrouter.post("/group",checkUserAuth,chatController.createGroupChat);
chatrouter.put("/group/rename",checkUserAuth,chatController.renameGroupName)
chatrouter.put("/groupadd",checkUserAuth,chatController.addGropuMember)
chatrouter.put("/groupremove",checkUserAuth,chatController.removeGropuMember)

module.exports=chatrouter;