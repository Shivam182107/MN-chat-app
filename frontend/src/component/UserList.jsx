import React, {
  useContext,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import { chatContext } from "../context/ChatContext";
import { authContext } from "../context/AuthContext";
import api from "../api/axiosInterceptor";
import {
  formatDateLabel,
  getOrMakeChat,
  getSenderDetails,
} from "../config/ChatLogic";
import { motion } from "framer-motion";

const ChatItems = memo(
  ({
    val,
    User,
    isGroupsOpen,
    isHavingNotification,
    notifCount,
    latestNotifDate,
    selectedChat,
    onChatClick,
  }) => {
    const senderUserDetails = useMemo(() => {
      return getSenderDetails(User, val.users, val.isGroupChat);
    }, [User, val.users, val.isGroupChat]);

    return (
      <div
        key={val._id}
        className={`p-3 flex rounded-2xl items-center hover:bg-[#2E2F2F] ${selectedChat?._id === val._id ? "bg-[#2E2F2F]" : "bg-[#161717]"}  cursor-pointer transition ${isGroupsOpen && !val.isGroupChat ? "hidden" : ""} animate-fade-in-up`}
        onClick={() => onChatClick(val, senderUserDetails)}
      >
        <div
          className="rounded-[50%] w-12 flex items-center"
          style={{
            border: !val.groupPic && val.isGroupChat ? "1px solid black" : "",
          }}
        >
          <img
            src={
              val.isGroupChat
                ? val.groupPic || "/GroupDefaultImage.png"
                : senderUserDetails?.pic
            }
            alt=""
            loading="lazy"
            className="w-full rounded-[50%]"
          />
        </div>

        <div className="w-full pl-2 flex flex-col justify-center">
          <p>
            {val.isGroupChat
              ? val.chatName
              : senderUserDetails?.fullname?.firstname}
          </p>
          <p className="text-[#ABACAC]">{val.latestMessage?.content || ""}</p>
        </div>

        {isHavingNotification && (
          <div className="flex flex-col items-end justify-center gap-1">
            <p className="text-[#5DC164] font-bold text-xs">
              {latestNotifDate}
            </p>
            <span className="bg-[#5DC164] font-bold text-black text-[11px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
              {notifCount}
            </span>
          </div>
        )}
      </div>
    );
  },
);
const UserList = ({ isGroupsOpen }) => {
  const {
    chatDetails,
    setchatDetails,
    selectedChat,
    setselectedChat,
    fetchChatAgain,
    setfetchChatAgain,
    Notification,
    setNotification,
    notificationMap,
    handleDeleteNotification,
  } = useContext(chatContext);
  const { User } = useContext(authContext);

  //get  all chats of the  user
  async function fetchChatList() {
    try {
      if (!chatDetails || fetchChatAgain) {
        const { data } = await api.get("/chat");
        setchatDetails(data);
        setfetchChatAgain(false);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    if (!fetchChatAgain) return;
    fetchChatList();
  }, [User, fetchChatAgain]);

  //notification sync  with chat
  useEffect(() => {
    if (Notification.length === 0) return;
    setchatDetails((prev) => {
      const uniqueNotifications = new Set();
      const latestAndUniqueMsg = Notification.filter((val) => {
        if (uniqueNotifications.has(val.chat._id)) return false;
        uniqueNotifications.add(val.chat._id);
        return true;
      });
      const notificationChats = latestAndUniqueMsg.map((val) => ({
        ...val.chat,
        latestMessage: {
          _id: val._id,
          content: val.content,
          createdAt: val.createdAt,
          sender: val.sender,
        },
      }));
      const filteredChats = prev.filter(
        (chat) => !notificationChats.some((n) => n._id === chat._id),
      );
      return [...notificationChats, ...filteredChats];
    });
  }, [Notification]);

  //also memoize the handleclick function
  const handleChatClick = useCallback(
    async (val, senderUserDetails) => {
      if (selectedChat?._id === val._id) return;
      if (notificationMap[val._id]) {
        handleDeleteNotification(val._id);
      }
      getOrMakeChat(
        senderUserDetails?._id,
        val.isGroupChat,
        val,
        setselectedChat,
        chatDetails,
      );
    },
    [selectedChat, notificationMap, chatDetails, setselectedChat],
  );
  const hasNoGroupChat = useMemo(() => {
    if (!chatDetails||!isGroupsOpen) return false ;
    return isGroupsOpen && !chatDetails.some((val) => val.isGroupChat);
  }, [isGroupsOpen,chatDetails]);

  if (chatDetails && chatDetails.length === 0&&!isGroupsOpen) {
    return (
      <motion.div
        className="p-4 bg-[#161717] flex flex-col justify-center rounded-lg items-center transition-all duration-300"
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

  
  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar pb-28 pl-2 w-full">
      {hasNoGroupChat ? (
        <div className="flex justify-center items-center h-[20%] text-gray-400 animate-fade-in-up">
          You have no groups yet. Create one to get started.
        </div>
      ) : (
        chatDetails &&
        chatDetails.map((val) => {
          const notifData = notificationMap[val._id];
          return (
            <ChatItems
              key={val._id}
              val={val}
              User={User}
              isGroupsOpen={isGroupsOpen}
              isHavingNotification={!!notifData}
              notifCount={notifData?.count || 0}
              latestNotifDate={notifData ? formatDateLabel(notifData.date) : ""}
              selectedChat={selectedChat}
              onChatClick={handleChatClick}
            />
          );
        })
      )}
    </div>
  );
};

export default UserList;
