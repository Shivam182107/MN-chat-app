const notificationModel = require("../models/notification.model");

module.exports.getAllNotification = async (req, res) => {
  try {
    const receiverid = req.user._id;
    const notification = await notificationModel
      .find({ receiverid: receiverid })
      .sort({ createdAt: -1 }) 
      .populate({
        path: "messageid",
        populate: [
          { path: "sender", select: "fullname pic " },
        {path:'chat',populate:{path:"users",select:"fullname pic "}}
        ]
      })
      .populate("chatid");
    res.status(200).json({ notification });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

module.exports.deleteNotification = async (req, res) => {
  try {
    const receiverid = req.user._id;
    const { id: chatid } = req.params;
    const notification = await notificationModel.deleteMany({
      receiverid: receiverid,
      isread: { $eq: false },
      chatid: chatid,
    });
    res.status(200).json({ message: "Notification deleted " });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};
