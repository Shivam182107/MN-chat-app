const express=require("express");
const callHistoryRouter=express.Router();
const {checkUserAuth}=require("../middlewares/auth.middleware");
const callHistoryController= require("../controllers/callhistory.controller");
callHistoryRouter.get("/",checkUserAuth,callHistoryController.getAllHistory)
callHistoryRouter.post("/",checkUserAuth,callHistoryController.createHistory)
callHistoryRouter.patch("/update",checkUserAuth,callHistoryController.updateHistory)
module.exports=callHistoryRouter;