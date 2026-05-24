// import { useContext, useEffect, useRef } from "react";
// import { FaPlus, FaSalesforce } from "react-icons/fa";
// import { IoSend } from "react-icons/io5";
// import { chatContext } from "../context/ChatContext";
// import { getSenderDetails } from "../config/ChatLogic";
// import { authContext } from "../context/AuthContext";
// import { MdCall } from "react-icons/md";
// import { BsCameraVideo } from "react-icons/bs";
// import { MdOutlineKeyboardBackspace } from "react-icons/md";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";
// import api from "../api/axiosInterceptor";


// const MessageContainer = () => {
//   const {
//     selectedChat,
//     setselectedChat,
//     setisGroupChatProfileOpen,
//     UserMessages,
//     setUserMessages,
//     Notification,
//     isGroupChatProfileOpen,
//   } = useContext(chatContext);
//   const { User,socketRef,isScoketConnected} = useContext(authContext);
//   const { pic, fullname } = getSenderDetails(
//     User,
//     selectedChat?.users,
//     selectedChat?.isGroupChat,
//   ) || { pic: "", fullname: "" };
//   const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
//   const [MsgInputValue, setMsgInputValue] = useState("");
//   const [Typing, setTyping] = useState(false);
//   const [isTyping, setisTyping] = useState(false);
//   const BottomRef = useRef(null);

//   function handleBackFeature() {
//     setselectedChat(null);
//   }
//   function handleMsgInput(e) {
//     setMsgInputValue(e.target.value);
//     if (!isScoketConnected) return;
//     if (!Typing) {
//       setTyping(true);
//       socketRef.current.emit("typing", selectedChat._id);
//     }
//     let lastTypingTime = new Date().getTime();
//     let timeLength = 3000;
//     setTimeout(() => {
//       let timeNow = new Date().getTime();
//       let timeDiffer = timeNow - lastTypingTime;
//       if (timeDiffer > timeLength && Typing) {
//         socketRef.current.emit("stop typing", selectedChat._id);
//         setTyping(false);
//       }
//     }, timeLength);
//   }
//   function handleSendingMessageByEnterKey(e) {
//     if (!MsgInputValue || MsgInputValue.trim() == "") return;
//     // console.log(e.key)
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (MsgInputValue) {
//         console.log(MsgInputValue);
//         sendMessage(MsgInputValue, selectedChat._id);
//       }
//     }
//   }
//   async function sendMessage(content, chatId) {
//     if (!content || !chatId) return;
//     try {
//       if (Typing) {
//         socketRef.current.emit("stop typing", chatId);
//         setTyping(false);
//       }
//       const messageResponse = await api.post("/message", { content, chatId });
//       if (messageResponse.status === 200) {
//         //  console.log("✅ emitting send message to server", messageResponse.data); // ADD THIS
//         socketRef.current.emit("send message", messageResponse.data);
//         setUserMessages((prev) => [...prev, messageResponse.data]);
//         setMsgInputValue("");
//       }
//     } catch (e) {
//       console.log(e);
//       console.log(e.message);
//     }
//   }
//   async function fetchAllMessageForThechat(chatId) {
//     if (!chatId) return;
//     try {
//       const messageResponse = await api.get(`/message/${chatId}`);
//       if (messageResponse.status === 200) {
//         setUserMessages(messageResponse.data);
//         socketRef.current.emit("join chat", chatId);
//       }
//     } catch (e) {
//       console.log(e);
//       consoel.log(e.message);
//     }
//   }
//   //fetching the messages for the slected chat
//   useEffect(() => {
//     if (!selectedChat) return;
//     fetchAllMessageForThechat(selectedChat._id);
//   }, [selectedChat]);
//   //socket work
//   useEffect(() => {
//     if(!isScoketConnected||!socketRef.current)return;
//     socketRef.current.on("typing", () => setisTyping(true));
//     socketRef.current.on("stop typing", () => setisTyping(false));
//   }, [selectedChat]);

//   useEffect(() => {
//     if (!UserMessages) return;
//     BottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [UserMessages, isTyping]);

//   // console.log(UserMessages, "inside message")
//   // console.log("msg component re rendering ");
//   // console.log(Notification, "--------------");
//   return (
//     <>
//       <div className={` flex-1 flex-col bg-[url('/MsgBoxImage.jpg')] ${isGroupChatProfileOpen?"hidden md:flex":"flex"}`}>
//         {/* Header */}
//         <header className="w-full sticky top-0 z-10">
//           <div className="h-12 bg-[#FFFFFF] border-b  shadow-2xl flex justify-between items-center">
//             <div className="flex  items-center pl-2">
//               <MdOutlineKeyboardBackspace
//                 size={24}
//                 className="md:hidden mr-2 cursor-pointer"
//                 onClick={handleBackFeature}
//               />

//               <div
//                 className=" w-8 rounded-[50%] ml-2 h-8 cursor-pointer"
//                 style={{
//                   border: selectedChat.isGroupChat ? "1px solid black " : "",
//                 }}
//                 onClick={() => {
//                   if (selectedChat.isGroupChat) {
//                     setisGroupChatProfileOpen(true);
//                   }
//                 }}
//               >
//                 <img
//                   src={
//                     selectedChat.isGroupChat ? "/GroupDefaultImage.png" : pic
//                   }
//                   alt=""
//                   className="w-full rounded-[50%]"
//                 />
//               </div>
//               <p className="ml-2">
//                 {selectedChat.isGroupChat
//                   ? selectedChat.chatName
//                   : fullname.firstname}
//               </p>
//             </div>
//             {!selectedChat?.isGroupChat && (
//               <div className="relative mr-4">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setIsCallPopupOpen((prev) => !prev);
//                   }}
//                   className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition"
//                 >
//                   <BsCameraVideo size={16} />
//                   <span className="text-sm font-medium">Call</span>
//                   <span className="text-xs">▼</span>
//                 </button>
//               </div>
//             )}

//             {/* ✅ Popup */}
//             <AnimatePresence>
//               {isCallPopupOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.85, y: -8 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.85, y: -8 }}
//                   transition={{
//                     type: "spring",
//                     stiffness: 260,
//                     damping: 20,
//                   }}
//                   style={{ transformOrigin: "top right" }}
//                   className="absolute right-4 top-14 z-50"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="bg-[#1f1f1f] text-white rounded-2xl shadow-2xl p-3 w-64">
//                     {/* Profile */}
//                     <div className="flex items-center gap-3 mb-3 px-2">
//                       <img src={pic} alt="" className="w-9 h-9 rounded-full" />
//                       <h2 className="font-medium text-sm">
//                         {fullname.firstname}
//                       </h2>
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-1">
//                       <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-sm">
//                         <MdCall size={18} />
//                         Voice call
//                       </button>

//                       <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-sm">
//                         <BsCameraVideo size={18} />
//                         Video call
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </header>
//         {/* shadow-[0_8px_20px_-6px_rgba(0,0,0,0.55)] */}
//         {/* Chat Area */}
//         <main className="flex-1 flex flex-col  overflow-hidden">
//           <div
//             className={`flex-1 overflow-y-auto msg-custom-scrollbar px-4 pt-4  space-y-3 flex flex-col`}
//           >
//             {UserMessages &&
//               UserMessages.map((val, idx) => {
//                 let isMyMessage = val.sender._id == User._id;
//                 // let isLastMessage = idx === UserMessages.length - 1 || UserMessages[idx + 1]?.sender._id != val.sender._id
//                 return (
//                   <div
//                     key={val._id}
//                     className={`w-full flex ${isMyMessage ? "justify-end" : "justify-start"}`}
//                   >
//                     {!isMyMessage ? (
//                       <div
//                         className={`relative bg-black text-white px-3 py-2 w-fit max-w-[65%] rounded-lg rounded-tl-none ${isMyMessage ? "justify-end" : "justify-start"} `}
//                       >
//                         {/* LEFT TAIL - flat top, diagonal bottom */}
//                         <span
//                           className="absolute left-[-7px] top-0 w-0 h-0
//                                     border-t-[0px] border-t-transparent
//                                     border-b-[10px] border-b-transparent
//                                     border-r-[8px] border-r-black"
//                         />

//                         {/* CONTENT ROW */}
//                         <div className="flex items-end gap-2">
//                           <p className="text-sm break-words">{val.content}</p>
//                           <span className="text-[11px] text-gray-500 whitespace-nowrap">
//                             {new Date(val.createdAt).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="relative bg-black text-white px-3 py-2 w-fit max-w-[65%] rounded-lg rounded-tr-none">
//                         <span
//                           className="absolute right-[-7px] top-0 w-0 h-0
//                                 border-t-[0px] border-t-transparent
//                                 border-b-[10px] border-b-transparent
//                                 border-l-[8px] border-l-black"
//                         />
//                         <div className="flex items-end gap-2">
//                           <p className="text-sm break-words">{val.content}</p>
//                           <span className="text-[11px] text-gray-500 whitespace-nowrap">
//                             {new Date(val.createdAt).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}

//             <div ref={BottomRef}></div>
//           </div>
//           {isTyping && (
//             <div className="flex items-center gap-[7px] bg-[#0a0a0a] px-[14px] py-3  my-4 rounded-full w-fit border border-white/10 mt-1 ml-4 flex-shrink-0">
//               <span className="w-2 h-2 rounded-full bg-white animate-[glowPop_1.5s_ease-in-out_infinite]" />
//               <span className="w-2 h-2 rounded-full bg-white animate-[glowPop_1.5s_ease-in-out_0.25s_infinite]" />
//               <span className="w-2 h-2 rounded-full bg-white animate-[glowPop_1.5s_ease-in-out_0.5s_infinite]" />
//             </div>
//           )}

//           <div className="px-2 py-1 w-full sticky bottom-0 z-10">
//             <form className="relative flex items-center">
//               {/* PLUS ICON */}
//               <FaPlus
//                 size={20}
//                 className="absolute left-4 text-white cursor-pointer"
//               />

//               {/* INPUT */}
//               <input
//                 type="text"
//                 placeholder="Type a message"
//                 className="py-3 pl-12 pr-12 bg-black text-white w-full rounded-full placeholder:text-gray-400 outline-none"
//                 value={MsgInputValue}
//                 onChange={handleMsgInput}
//                 onKeyDown={handleSendingMessageByEnterKey}
//               />

//               {/* SEND ICON */}
//               <IoSend
//                 size={20}
//                 className="absolute right-4 text-white cursor-pointer"
//                 onClick={() => sendMessage(MsgInputValue, selectedChat._id)}
//               />
//             </form>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// export default MessageContainer;
import { useContext, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { chatContext } from "../context/ChatContext";
import { getSenderDetails } from "../config/ChatLogic";
import { authContext } from "../context/AuthContext";
import { MdCall } from "react-icons/md";
import { BsCameraVideo } from "react-icons/bs";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import api from "../api/axiosInterceptor";

const MessageContainer = () => {
  const {
    selectedChat, setselectedChat,
    setisGroupChatProfileOpen,
    UserMessages, setUserMessages,
    Notification, isGroupChatProfileOpen,
    startCall, // ← NEW: from chatContext
  } = useContext(chatContext);
  const { User, socketRef, isScoketConnected } = useContext(authContext);

  const { pic, fullname } = getSenderDetails(User, selectedChat?.users, selectedChat?.isGroupChat) || { pic: "", fullname: "" };

  const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
  const [MsgInputValue, setMsgInputValue] = useState("");
  const [Typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const BottomRef = useRef(null);

  // get the other user's _id for calling
  const otherUser = selectedChat?.users?.find((u) => u._id !== User._id);

  function handleBackFeature() { setselectedChat(null); }

  function handleMsgInput(e) {
    setMsgInputValue(e.target.value);
    if (!isScoketConnected) return;
    if (!Typing) {
      setTyping(true);
      socketRef.current.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timeLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      if (timeNow - lastTypingTime > timeLength && Typing) {
        socketRef.current.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  }

  function handleSendingMessageByEnterKey(e) {
    if (!MsgInputValue || MsgInputValue.trim() == "") return;
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(MsgInputValue, selectedChat._id);
    }
  }

  async function sendMessage(content, chatId) {
    if (!content || !chatId) return;
    try {
      if (Typing) { socketRef.current.emit("stop typing", chatId); setTyping(false); }
      const messageResponse = await api.post("/message", { content, chatId });
      if (messageResponse.status === 200) {
        socketRef.current.emit("send message", messageResponse.data);
        setUserMessages((prev) => [...prev, messageResponse.data]);
        setMsgInputValue("");
      }
    } catch (e) { console.log(e.message); }
  }

  async function fetchAllMessageForThechat(chatId) {
    if (!chatId) return;
    try {
      const messageResponse = await api.get(`/message/${chatId}`);
      if (messageResponse.status === 200) {
        setUserMessages(messageResponse.data);
        socketRef.current.emit("join chat", chatId);
      }
    } catch (e) { console.log(e.message); }
  }

  useEffect(() => {
    if (!selectedChat) return;
    fetchAllMessageForThechat(selectedChat._id);
  }, [selectedChat]);

  useEffect(() => {
    if (!isScoketConnected || !socketRef.current) return;
    socketRef.current.on("typing", () => setisTyping(true));
    socketRef.current.on("stop typing", () => setisTyping(false));
  }, [selectedChat]);

  useEffect(() => {
    if (!UserMessages) return;
    BottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [UserMessages, isTyping]);

  return (
    <>
      <div className={`flex-1 flex-col bg-[url('/MsgBoxImage.jpg')] ${isGroupChatProfileOpen ? "hidden md:flex" : "flex"}`}>
        {/* Header */}
        <header className="w-full sticky top-0 z-10">
          <div className="h-12 bg-[#FFFFFF] border-b shadow-2xl flex justify-between items-center">
            <div className="flex items-center pl-2">
              <MdOutlineKeyboardBackspace size={24} className="md:hidden mr-2 cursor-pointer" onClick={handleBackFeature} />
              <div className="w-8 rounded-[50%] ml-2 h-8 cursor-pointer"
                style={{ border: selectedChat.isGroupChat ? "1px solid black" : "" }}
                onClick={() => { if (selectedChat.isGroupChat) setisGroupChatProfileOpen(true); }}>
                <img src={selectedChat.isGroupChat ? "/GroupDefaultImage.png" : pic} alt="" className="w-full rounded-[50%]" />
              </div>
              <p className="ml-2">{selectedChat.isGroupChat ? selectedChat.chatName : fullname.firstname}</p>
            </div>

            {!selectedChat?.isGroupChat && (
              <div className="relative mr-4">
                <button onClick={(e) => { e.stopPropagation(); setIsCallPopupOpen((prev) => !prev); }}
                  className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition">
                  <BsCameraVideo size={16} />
                  <span className="text-sm font-medium">Call</span>
                  <span className="text-xs">▼</span>
                </button>
              </div>
            )}

            <AnimatePresence>
              {isCallPopupOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{ transformOrigin: "top right" }}
                  className="absolute right-4 top-14 z-50"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="bg-[#1f1f1f] text-white rounded-2xl shadow-2xl p-3 w-64">
                    <div className="flex items-center gap-3 mb-3 px-2">
                      <img src={pic} alt="" className="w-9 h-9 rounded-full" />
                      <h2 className="font-medium text-sm">{fullname.firstname}</h2>
                    </div>
                    <div className="flex flex-col gap-1">
                      {/* ── VOICE CALL BUTTON ── */}
                      <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-sm"
                        onClick={() => {
                          setIsCallPopupOpen(false);
                          startCall(false, otherUser._id,User); // audio only
                          console.log("audio call")
                        }}>
                        <MdCall size={18} />
                        Voice call
                      </button>
                      {/* ── VIDEO CALL BUTTON ── */}
                      <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-sm"
                        onClick={() => {
                          setIsCallPopupOpen(false);
                          startCall(true, otherUser._id,User); // with video
                          console.log("video call")
                        }}>
                        <BsCameraVideo size={18} />
                        Video call
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto msg-custom-scrollbar px-4 pt-4 space-y-3 flex flex-col">
            {UserMessages && UserMessages.map((val) => {
              let isMyMessage = val.sender._id == User._id;
              return (
                <div key={val._id} className={`w-full flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                  {!isMyMessage ? (
                    <div className="relative bg-black text-white px-3 py-2 w-fit max-w-[65%] rounded-lg rounded-tl-none">
                      <span className="absolute left-[-7px] top-0 w-0 h-0 border-t-[0px] border-t-transparent border-b-[10px] border-b-transparent border-r-[8px] border-r-black" />
                      <div className="flex items-end gap-2">
                        <p className="text-sm break-words">{val.content}</p>
                        <span className="text-[11px] text-gray-500 whitespace-nowrap">
                          {new Date(val.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-black text-white px-3 py-2 w-fit max-w-[65%] rounded-lg rounded-tr-none">
                      <span className="absolute right-[-7px] top-0 w-0 h-0 border-t-[0px] border-t-transparent border-b-[10px] border-b-transparent border-l-[8px] border-l-black" />
                      <div className="flex items-end gap-2">
                        <p className="text-sm break-words">{val.content}</p>
                        <span className="text-[11px] text-gray-500 whitespace-nowrap">
                          {new Date(val.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={BottomRef}></div>
          </div>

          {isTyping && (
            <div className="flex items-center gap-[7px] bg-[#0a0a0a] px-[14px] py-3 my-4 rounded-full w-fit border border-white/10 mt-1 ml-4 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-white animate-[glowPop_1.5s_ease-in-out_infinite]" />
              <span className="w-2 h-2 rounded-full bg-white animate-[glowPop_1.5s_ease-in-out_0.25s_infinite]" />
              <span className="w-2 h-2 rounded-full bg-white animate-[glowPop_1.5s_ease-in-out_0.5s_infinite]" />
            </div>
          )}

          <div className="px-2 py-1 w-full sticky bottom-0 z-10">
            <form className="relative flex items-center">
              <FaPlus size={20} className="absolute left-4 text-white cursor-pointer" />
              <input type="text" placeholder="Type a message"
                className="py-3 pl-12 pr-12 bg-black text-white w-full rounded-full placeholder:text-gray-400 outline-none"
                value={MsgInputValue} onChange={handleMsgInput} onKeyDown={handleSendingMessageByEnterKey} />
              <IoSend size={20} className="absolute right-4 text-white cursor-pointer"
                onClick={() => sendMessage(MsgInputValue, selectedChat._id)} />
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default MessageContainer;