// import { useEffect, useRef, useState } from "react";
// import Navabar from "../component/Navabar";
// import { RiChatNewFill } from "react-icons/ri";
// import { BsCameraVideo, BsThreeDotsVertical } from "react-icons/bs";
// import { FaSearch } from "react-icons/fa";
// import { BsChatSquareTextFill } from "react-icons/bs";
// import { MdCall } from "react-icons/md";
// import { MdOutlineGroupAdd } from "react-icons/md";
// import { MdGroup } from "react-icons/md";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router";
// import CreateGroup from "../component/CreateGroup";
// import UserList from "../component/UserList";
// import Profile from "../component/Profile";
// import MessageContainer from "../component/MessageContainer";
// import { useContext } from "react";
// import { chatContext } from "../context/ChatContext";
// import SearchUserModal from "../component/SearchUserModal";
// import GroupChatProfile from "../component/GroupChatProfile";
// import { authContext } from "../context/AuthContext";
// import { io } from "socket.io-client";
// const Home = () => {
//   const [isPopupOpen, setisPopupOpen] = useState(false);
//   const searchRef = useRef(null);
//   const [GroupCreation, setGroupCreation] = useState(false);
//   const [isProfileActive, setisProfileActive] = useState(false);
//   const {
//     selectedChat,
//     selectedGroupMember,
//     setselectedGroupMember,
//     GroupName,
//     setGroupName,
//     isGroupChatProfileOpen,
//     Notification,
//   } = useContext(chatContext);
//   const [isOpenSearchUserModal, setisOpenSearchUserModal] = useState(false);
//   const [searchInputValue, setsearchInputValue] = useState("");
//   const [isGroupsOpen, setisGroupsOpen] = useState(false);
//   const { User, isScoketConnected, setisScoketConnected, socketRef } =
//     useContext(authContext);

//   const navigate = useNavigate();
//   function removeGroupCreate() {
//     setGroupCreation((prev) => !prev);
//   }
//   function profileActivate() {
//     setisProfileActive((prev) => !prev);
//   }
//   function handleSearch() {
//     if (!searchRef.current.value || searchRef.current.value.trim() == "") {
//       setsearchInputValue("");
//       return;
//     }
//     setsearchInputValue(searchRef.current.value);
//     setisOpenSearchUserModal(true);
//   }
//   //  console.log("Home reddering ......")
//   function handleInput() {
//     setsearchInputValue("");
//   }
//   //creating socket connection .Only authenticated User can make socket connction
//   useEffect(() => {
//     if (!User) return;
//     socketRef.current = io(import.meta.env.VITE_BASE_URL);
//     socketRef.current.on("connect", () => {
//       setisScoketConnected(true);
//       // console.log("✅ Socket connected inside home .jsx  socketRef.current.id=", socketRef.current.id);
//       socketRef.current.emit("setup", User);
//     });
//   }, [User]);

//   return (
//     <>
//       <div className="h-screen flex flex-col bg-[#F7F5F3]">
//         <Navabar profileActivate={profileActivate} />

//         {/* 🔥 Main Layout */}
//         <div className="flex flex-1 overflow-hidden relative">
//           {/* 🟥 Sidebar */}
//           <div
//             className={`md:w-16 md:h-full bg-[#1D1F1F] text-white flex md:flex-col items-center md:relative py-4 absolute bottom-0 w-full h-24 justify-evenly ${selectedChat ? "hidden md:flex " : "flex"}`}
//           >
//             <div className="relative ">
//               {Notification.length > 0 && (
//                 <span className="absolute -top-3 -right-3 bg-[#58B960] text-grenn-900 text-xs px-1.5 py-0.5 rounded-full">
//                   {Notification.length}
//                 </span>
//               )}
//               <BsChatSquareTextFill
//                 size={25}
//                 className="cursor-pointer"
//                 onClick={() => {
//                   if (isGroupsOpen) {
//                     setisGroupsOpen(false);
//                   }
//                   if (GroupCreation) {
//                     setGroupCreation(false);
//                   }
//                   if (isProfileActive) {
//                     setisProfileActive(false);
//                   }
//                   if (selectedGroupMember.length > 0) {
//                     setselectedGroupMember([]);
//                     if (GroupName) {
//                       setGroupName(null);
//                     }
//                   }
//                   navigate("/");
//                 }}
//               />
//             </div>
//             <MdGroup
//               size={25}
//               className="cursor-pointer"
//               onClick={() => {
//                 setisGroupsOpen(true);
//               }}
//             />
//             <MdOutlineGroupAdd
//               size={25}
//               onClick={() => {
//                 setGroupCreation((prev) => !prev);
//               }}
//               className="hover:cursor-pointer"
//             />
//             <MdCall size={25} />
//             <BsCameraVideo size={25} />
//           </div>

//           {/* 🟦 Chat List */}
//           {isProfileActive ? (
//             <Profile />
//           ) : GroupCreation ? (
//             <CreateGroup removeGroupCreate={removeGroupCreate} />
//           ) : (
//             <div className="flex  w-full">
//               {isGroupChatProfileOpen ? (
//                 <GroupChatProfile />
//               ) : (
//                 <div
//                   className={`md:w-[410px] flex-shrink-0 w-full bg-[#161717] text-white border-r border-black flex flex-col ${selectedChat ? "hidden md:flex " : "flex"}`}
//                 >
//                   {/* Header */}
//                   <div className="flex justify-between items-center py-4 px-4 relative">
//                     <h1 className="text-3xl font-medium">Chats</h1>
//                     <span className="flex items-center gap-3 text-xl">
//                       <RiChatNewFill
//                         onClick={() => {
//                           searchRef.current.focus();
//                         }}
//                         className="hover:cursor-pointer"
//                       />
//                       <BsThreeDotsVertical
//                         onClick={() => {
//                           setisPopupOpen((prev) => !prev);
//                         }}
//                         className="hover:cursor-pointer relative"
//                       />
//                       {isPopupOpen && (
//                         <div className="absolute right-[9%] top-4 mt-4 z-50">
//                           {/* Popup Box */}
//                           <div className="backdrop-blur-xl bg-black/90 text-white rounded-xl shadow-2xl py-2 w-52 border border-white/10 ring-1 ring-white/5">
//                             <Link
//                               to=""
//                               className="block px-4 py-2 text-base hover:bg-white/10 transition"
//                             >
//                               Read Messages
//                             </Link>

//                             <Link
//                               to=""
//                               className="block px-4 py-2 text-base hover:bg-white/10 transition"
//                             >
//                               Unread Messages
//                             </Link>

//                             <Link
//                               to=""
//                               className="block px-4 py-2 text-base hover:bg-white/10 transition"
//                             >
//                               Star Messages
//                             </Link>
//                           </div>
//                         </div>
//                       )}
//                     </span>
//                   </div>

//                   {/* Search */}
//                   <div className="mb-4 relative px-4 relative ">
//                     <input
//                       type="text"
//                       name="Search"
//                       className="bg-[#2E2F2F] w-full py-2 rounded-full pl-10 placeholder:text-[#9FACAC] focus:outline-none focus:ring-2 focus:ring-[#5CC064]"
//                       placeholder="Search or start a new chat"
//                       ref={searchRef}
//                       onChange={handleSearch}
//                       value={searchInputValue}
//                     />

//                     <FaSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 " />
//                     {isOpenSearchUserModal && (
//                       <SearchUserModal
//                         SearchValue={searchInputValue}
//                         handleInput={handleInput}
//                       />
//                     )}
//                   </div>

//                   {/*  Scrollable Chat List component */}
//                   <UserList isGroupsOpen={isGroupsOpen} />
//                 </div>
//               )}

//               {/* ⬜ Chat Window */}
//               {selectedChat ? (
//                 <MessageContainer />
//               ) : (
//                 <div className="hidden md:flex flex-1 bg-gray-100 items-center justify-center">
//                   <motion.h1
//                     className="text-3xl lg:text-5xl font-medium text-center px-4"
//                     initial={{ opacity: 0, y: 60 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.8, ease: "easeOut" }}
//                   >
//                     Welcome buddy once again
//                   </motion.h1>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;


import { useEffect, useRef, useState } from "react";
import Navabar from "../component/Navabar";
import { RiChatNewFill } from "react-icons/ri";
import { BsCameraVideo, BsThreeDotsVertical } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { BsChatSquareTextFill } from "react-icons/bs";
import { MdCall } from "react-icons/md";
import { MdOutlineGroupAdd } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import CreateGroup from "../component/CreateGroup";
import UserList from "../component/UserList";
import Profile from "../component/Profile";
import MessageContainer from "../component/MessageContainer";
import { useContext } from "react";
import { chatContext } from "../context/ChatContext";
import SearchUserModal from "../component/SearchUserModal";
import GroupChatProfile from "../component/GroupChatProfile";
import { authContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import CallModal from "../component/CallModal"; // ← NEW

const Home = () => {
  const [isPopupOpen, setisPopupOpen] = useState(false);
  const searchRef = useRef(null);
  const [GroupCreation, setGroupCreation] = useState(false);
  const [isProfileActive, setisProfileActive] = useState(false);
  const {
    selectedChat,
    selectedGroupMember,
    setselectedGroupMember,
    GroupName,
    setGroupName,
    isGroupChatProfileOpen,
    Notification,
    callState,   // ← NEW
    incomingCall, // ← NEW
  } = useContext(chatContext);
  const [isOpenSearchUserModal, setisOpenSearchUserModal] = useState(false);
  const [searchInputValue, setsearchInputValue] = useState("");
  const [isGroupsOpen, setisGroupsOpen] = useState(false);
  const { User, isScoketConnected, setisScoketConnected, socketRef } = useContext(authContext);

  const navigate = useNavigate();

  function removeGroupCreate() { setGroupCreation((prev) => !prev); }
  function profileActivate() { setisProfileActive((prev) => !prev); }

  function handleSearch() {
    if (!searchRef.current.value || searchRef.current.value.trim() == "") {
      setsearchInputValue(""); return;
    }
    setsearchInputValue(searchRef.current.value);
    setisOpenSearchUserModal(true);
  }
  function handleInput() { setsearchInputValue(""); }

  useEffect(() => {
    if (!User) return;
    socketRef.current = io("import.meta.env.VITE_BASE_URL");//import.meta.env.VITE_BASE_URL
    socketRef.current.on("connect", () => {
      setisScoketConnected(true);
      socketRef.current.emit("setup", User);
    });
  }, [User]);

  return (
    <>
      <div className="h-screen flex flex-col bg-[#F7F5F3]">
        <Navabar profileActivate={profileActivate} />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
          <div className={`md:w-16 md:h-full bg-[#1D1F1F] text-white flex md:flex-col items-center md:relative py-4 absolute bottom-0 w-full h-24 justify-evenly ${selectedChat ? "hidden md:flex " : "flex"}`}>
            <div className="relative ">
              {Notification.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-[#58B960] text-grenn-900 text-xs px-1.5 py-0.5 rounded-full">
                  {Notification.length}
                </span>
              )}
              <BsChatSquareTextFill size={25} className="cursor-pointer"
                onClick={() => {
                  if (isGroupsOpen) setisGroupsOpen(false);
                  if (GroupCreation) setGroupCreation(false);
                  if (isProfileActive) setisProfileActive(false);
                  if (selectedGroupMember.length > 0) {
                    setselectedGroupMember([]);
                    if (GroupName) setGroupName(null);
                  }
                  navigate("/");
                }} />
            </div>
            <MdGroup size={25} className="cursor-pointer" onClick={() => setisGroupsOpen(true)} />
            <MdOutlineGroupAdd size={25} onClick={() => setGroupCreation((prev) => !prev)} className="hover:cursor-pointer" />
            <MdCall size={25} />
            <BsCameraVideo size={25} />
          </div>

          {/* Chat List */}
          {isProfileActive ? (
            <Profile />
          ) : GroupCreation ? (
            <CreateGroup removeGroupCreate={removeGroupCreate} />
          ) : (
            <div className="flex w-full">
              {isGroupChatProfileOpen ? (
                <GroupChatProfile />
              ) : (
                <div className={`md:w-[410px] flex-shrink-0 w-full bg-[#161717] text-white border-r border-black flex flex-col ${selectedChat ? "hidden md:flex " : "flex"}`}>
                  <div className="flex justify-between items-center py-4 px-4 relative">
                    <h1 className="text-3xl font-medium">Chats</h1>
                    <span className="flex items-center gap-3 text-xl">
                      <RiChatNewFill onClick={() => searchRef.current.focus()} className="hover:cursor-pointer" />
                      <BsThreeDotsVertical onClick={() => setisPopupOpen((prev) => !prev)} className="hover:cursor-pointer relative" />
                      {isPopupOpen && (
                        <div className="absolute right-[9%] top-4 mt-4 z-50">
                          <div className="backdrop-blur-xl bg-black/90 text-white rounded-xl shadow-2xl py-2 w-52 border border-white/10 ring-1 ring-white/5">
                            <Link to="" className="block px-4 py-2 text-base hover:bg-white/10 transition">Read Messages</Link>
                            <Link to="" className="block px-4 py-2 text-base hover:bg-white/10 transition">Unread Messages</Link>
                            <Link to="" className="block px-4 py-2 text-base hover:bg-white/10 transition">Star Messages</Link>
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                  <div className="mb-4 relative px-4 relative ">
                    <input type="text" name="Search"
                      className="bg-[#2E2F2F] w-full py-2 rounded-full pl-10 placeholder:text-[#9FACAC] focus:outline-none focus:ring-2 focus:ring-[#5CC064]"
                      placeholder="Search or start a new chat"
                      ref={searchRef} onChange={handleSearch} value={searchInputValue} />
                    <FaSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 " />
                    {isOpenSearchUserModal && <SearchUserModal SearchValue={searchInputValue} handleInput={handleInput} />}
                  </div>
                  <UserList isGroupsOpen={isGroupsOpen} />
                </div>
              )}

              {selectedChat ? (
                <MessageContainer />
              ) : (
                <div className="hidden md:flex flex-1 bg-gray-100 items-center justify-center">
                  <motion.h1
                    className="text-3xl lg:text-5xl font-medium text-center px-4"
                    initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}>
                    Welcome buddy once again
                  </motion.h1>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CALL MODAL — renders on top of everything when call is active ── */}
       <CallModal />
    </>
  );
};

export default Home;