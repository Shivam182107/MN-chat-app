const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    senderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    receiverid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    messageid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messageModel",
    },
    chatid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatModel",
    },
    isread: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const notificationModel=mongoose.model("notificationModel",notificationSchema);
module.exports=notificationModel;
