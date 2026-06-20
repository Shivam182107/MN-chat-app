const chatModel = require("../models/chat.model");
const user = require("../models/user.model");

module.exports.accesPrivateChat = async (req, res) => {
  //create or return chat if exist betwenn user
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  const isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
    .populate("users", "-password")
    .populate({
      path:"latestMessage",
      populate:{path:"sender",select:"fullname email pic"}
    });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    try {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const chat = await chatModel.create(chatData);
      const fetchChat = await chatModel
        .findOne({ _id: chat._id })
        .populate("users", "-password");
      res.status(200).json(fetchChat);
    } catch (e) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};
module.exports.fecthAllChat = async (req, res) => {
  try {
    let Chats = await chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    Chats = await user.populate(Chats, {
      path: "latestMessage.sender",
      select: "fullname email pic",
    });

    res.status(200).json(Chats);
  } catch (e) {
    res.status(400);
    console.log(e);
    throw new Error(e.message);
  }
};
module.exports.createGroupChat = async (req, res) => {
  const { name, users } = req.body;
  if (!name || !users) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  // console.log(req.body)
  const parseUser = users;
  console.log(parseUser);
  if (parseUser.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }
  parseUser.push(req.user);
  try {
    const groupChat = await chatModel.create({
      chatName: name,
      users: parseUser,
      isGroupChat: true,
      groupAdmin: [req.user],
    });
    const fullGroupchat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupchat);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
};
module.exports.renameGroupName = async (req, res) => {
  const { name, chatId } = req.body;
  try {
    const updatedChat = await chatModel
      .findByIdAndUpdate({ _id: chatId }, { chatName: name }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (e) {
    console.log(e);
    return res.status(404).json(e.message);
  }
};
module.exports.addGropuMember = async (req, res) => {
  const { chatId, addUser, adminId } = req.body;
  if (!chatId || !addUser) {
    return res.status(400).json({ message: "Invalid users data" });
  }
  try {
    const RequestedChat = await chatModel.findOne({ _id: chatId });
    const isAdmin = RequestedChat.groupAdmin.some(
      (val) => val._id.toString() === adminId,
    );
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admin can add users" });
    }
    const userIdArray = addUser.map((val) => val._id);
    const updatedChat = await chatModel
      .findByIdAndUpdate(
        { _id: chatId },
        { $push: { users: { $each: userIdArray } } },
        { new: true },
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (updatedChat) {
      res.status(200).json(updatedChat);
    } else {
      res.status(404).json({ message: "Chat not found" });
    }
  } catch (e) {
    res.status(404).json(e.message);
  }
};
module.exports.removeGropuMember = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const updatedChat = await chatModel
      .findByIdAndUpdate(
        { _id: chatId },
        { $pull: { users: userId } },
        { new: true },
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (updatedChat) {
      res.status(200).json(updatedChat);
    } else {
      res.status(404).json({ message: "Chat not found" });
    }
  } catch (e) {
    res.status(404).json(e.message);
  }
};
