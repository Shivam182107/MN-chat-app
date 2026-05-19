import React, { useContext, useEffect } from "react";
import { chatContext } from "../context/ChatContext";
import { authContext } from "../context/AuthContext";
import api from "../api/axiosInterceptor";
import { getOrMakeChat, getSenderDetails } from "../config/ChatLogic";
import { motion } from "framer-motion";

const UserList = ({ isGroupsOpen }) => {
  const {
    chatDetails,
    setchatDetails,
    setselectedChat,
    fetchChatAgain,
    setfetchChatAgain,
    Notification,
    setNotification,
  } = useContext(chatContext);
  const { User } = useContext(authContext);

  async function fetchChatList() {
    try {
      // if (chatDetails) return;
      if (!chatDetails || fetchChatAgain) {
        const { data } = await api.get("/chat");
        console.log("Fetching userlist ");
        // console.log(data);
        setchatDetails(data);
        setfetchChatAgain(false);
      }
    } catch (e) {
      console.log(e);
      console.log(e.message);
    }
  }
  useEffect(() => {
    if (!fetchChatAgain) return;
    fetchChatList();
  }, [User, fetchChatAgain]);
  useEffect(() => {
    if (Notification.length === 0) return;
    if (Notification.length > 0) {
      setchatDetails((prev) => {
        const notificationChats = Notification.map((val) => ({
          ...val.chat,
          latestMessage: {
            _id: val._id,
            content: val.content,
            createdAt: val.createdAt,
            sender: val.sender,
          },
        }));
        const arr = [...prev];
        // remove duplicates from fetched data
        const filteredChats = arr.filter(
          (chat) =>
            !notificationChats.some((notifChat) => notifChat._id === chat._id),
        );

        // notifications first, then remaining chats
        return [...notificationChats, ...filteredChats];
      });
    }
  }, [Notification]);
  if (chatDetails && chatDetails.length === 0) {
    return (
      <motion.div
        className="p-4 bg-[#161717] flex flex-col justify-center rounded-lg items-center 
              transition-all duration-300 "
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h1
          className="text-center text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Search users by <span className="font-semibold">name</span> or{" "}
          <span className="font-semibold">email</span> and start a conversation.
        </motion.h1>

        <motion.h1
          className="text-center mt-2 ml-4 text-gray-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Have a great day, user! 👋
        </motion.h1>
      </motion.div>
    );
  }
  //  console.log("userlist rendering ......")
  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar  pb-28 pl-2 w-full ">
        {chatDetails &&
          chatDetails.map((val, idx) => {
            let senderUserDetails = getSenderDetails(
              User,
              val.users,
              val.isGroupChat,
            );
            let isHavingNotification = Notification.some(
              (item) => item.chat._id === val._id,
            );
            return (
              <div
                key={idx}
                className={`p-3 bg-[#161717] flex rounded items-center hover:bg-[#2E2F2F] cursor-pointer transition ${isGroupsOpen && !val.isGroupChat ? "hidden" : ""}`}
                onClick={() => {
                  if (Notification.length > 0) {
                    if (isHavingNotification) {
                      setNotification((prev) => {
                        return prev.filter((item) => item.chat._id != val._id);
                      });
                    }
                  }
                  //make or get chat  function
                  getOrMakeChat(
                    senderUserDetails?._id,
                    val.isGroupChat,
                    val,
                    setselectedChat,
                  );
                }}
              >
                {/* image div  */}
                <div
                  className="rounded-[50%] w-12 flex items-center  "
                  style={{
                    border:
                      !val.groupPic && val.isGroupChat ? "1px solid black" : "",
                  }}
                >
                  <img
                    src={
                      val.isGroupChat
                        ? val.groupPic || "/GroupDefaultImage.png"
                        : getSenderDetails(User, val.users, val.isGroupChat)
                            ?.pic
                    }
                    alt=""
                    className="w-full rounded-[50%] "
                  />
                </div>
                {/* image div  */}

                <div className=" w-full pl-2 flex flex-col justify-center ">
                  <p>
                    {val.isGroupChat
                      ? val.chatName
                      : senderUserDetails?.fullname?.firstname}
                  </p>
                  <p className="text-[#ABACAC]">
                    {val.latestMessage?.content || ""}
                  </p>
                </div>
                {Notification.length > 0 && isHavingNotification && (
                  <div className="flex flex-col items-end justify-center gap-1">
                    {/* Date */}
                    <p className="text-[#5DC164] font-bold text-xs">
                      {new Date(
                        val.latestMessage?.createdAt,
                      ).toLocaleDateString()}
                    </p>

                    {/* Badge */}
                    <span className="bg-[#5DC164] font-bold text-black text-[11px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                      {
                        Notification.filter((item) => item.chat._id === val._id)
                          .length
                      }
                    </span>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default UserList;
