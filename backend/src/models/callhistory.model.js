const mongoose = require("mongoose");
const callhistorySchema = new mongoose.Schema(
  {
    callerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["answered", "missed", "rejected", "no-answer", "cancelled"],
      required: true,
    },
    callType: {
      type: String,
      enum: ["video", "audio"],
      required: true,
    },
    withVideo: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: null,
    },
    // missedby: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "user",
    // },
    isUserVisited: {
      type: Boolean,
      default: false,
    },
    Type:{
      type:String,
      enum:["incoming","outgoing"]
    }
  },
  { timestamps: true },
);

const callHistoryModel = mongoose.model("callHistoryModel", callhistorySchema);
module.exports = callHistoryModel;
