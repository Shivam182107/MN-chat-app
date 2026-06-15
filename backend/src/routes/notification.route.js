const express=require("express");
const { checkUserAuth } = require("../middlewares/auth.middleware");
const notificationController=require("../controllers/notification.controller")
const notificationRouter=express.Router();
notificationRouter.get("/",checkUserAuth,notificationController.getAllNotification);
notificationRouter.delete("/:id",checkUserAuth,notificationController.deleteNotification)
module.exports=notificationRouter;