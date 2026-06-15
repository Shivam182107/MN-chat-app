const callHistoryModel = require("../models/callhistory.model");

module.exports.getAllHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const history = await callHistoryModel
      .find({ $or: [{ callerid: req.user._id }, { receiverid: req.user._id }] })
      .populate("callerid", "fullname pic");
    return res.status(200).json({
      history,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports.createHistory = async (req, res) => {
  try {
    const {
      callerid,
      receiverid,
      Type,
      status,
      callType,
      withVideo,
      duration,
    } = req.body;
    if (
      !callerid ||
      !receiverid ||
      !Type ||
      !status ||
      !callType ||
      !withVideo ||
      !duration
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const history=await callHistoryModel.create(req.body);
    res.status(201).json(history);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports.updateHistory = async (req, res) => {
  try {
    const updateHistory=await callHistoryModel.updateMany({receiverid:req.user._id, isUserVisited:false},{$set:{isUserVisited:true}});
    res.status(200).json({message:"History update successfully"})
  } catch (error) {
       return res.status(500).json({ success: false, message: error.message }); 

  }
};
