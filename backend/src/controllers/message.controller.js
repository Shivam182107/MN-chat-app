const messageModel = require("../models/messgae.model");
const chatModel = require("../models/chat.model");
const user = require("../models/user.model");
const notificationModel = require("../models/notification.model");

module.exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId || !req.user) {
    return res
      .status(400)
      .json({ message: "invalid data passed for sending the message" });
  }
  try {
    let newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    let createdMessage = await messageModel.create(newMessage);
    createdMessage = await createdMessage.populate(
      "sender",
      "fullname pic email",
    );
    createdMessage = await createdMessage.populate("chat");
    createdMessage = await user.populate(createdMessage, {
      path: "chat.users",
      select: "fullname pic email",
    });
    const updateReferencedChat = await chatModel.findByIdAndUpdate(
      { _id: chatId },
      { latestMessage: createdMessage._id },
    );

    //create notification  for each user which are associated with this chat
    await Promise.all(
      createdMessage.chat.users
        .filter((val) => val._id.toString() != createdMessage.sender._id.toString())
        .map((val) => {
          return notificationModel.create({
            senderid: createdMessage.sender._id,
            receiverid: val._id,
            messageid: createdMessage._id,
            chatid: createdMessage.chat._id,
          });
        }),
    );
    res.status(200).json(createdMessage);
  } catch (e) {
    console.log(e);
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
};

module.exports.allMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    if (!chatId) {
      return res.status(400).json({ message: "chatId is missing" });
    }
    const message = await messageModel
      .find({ chat: chatId })
      .populate("sender", "fullname pic email")
      .populate("chat");
    res.status(200).json(message);
  } catch (e) {
    console.log(e);
    console.log(e.emssage);
    res.status(500).json({
      // ✅ Send error response
      error: e.message,
    });
  }
};
module.exports.setReadBy = async (req, res) => {
  const { chatId } = req.params;
  const { seenedUserId } = req.body;
  try {
    if (!chatId) {
      return res.status(400).json({ message: "chatId is missing" });
    }
    if (!seenedUserId) {
      return res.status(400).json({ message: "seenedUserId is missing" });
    }
    const message = await messageModel.updateMany(
      { chat: chatId, readBy: { $ne: seenedUserId } },
      { $addToSet: { readBy: seenedUserId } },
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (e) {
    console.log(e);
    console.log(e.emssage);
    res.status(500).json({
      // ✅ Send error response
      error: e.message,
    });
  }
};
