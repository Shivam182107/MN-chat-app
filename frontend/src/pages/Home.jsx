import { lazy, Suspense, useEffect, useRef, useState, useContext } from "react";
import { RiChatNewFill } from "react-icons/ri";
import { BsCameraVideo, BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { BsChatSquareTextFill } from "react-icons/bs";
import { MdCall } from "react-icons/md";
import { MdOutlineGroupAdd } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { io } from "socket.io-client";
import { chatContext } from "../context/ChatContext";
import { authContext } from "../context/AuthContext";

import Navabar from "../component/Navabar";
import UserList from "../component/UserList";
import api from "../api/axiosInterceptor";
import HomeSkeleton from "./HomeSkeleton";
import SearchUserModal from "../component/SearchUserModal";

const CreateGroup = lazy(() => import("../component/CreateGroup"));
const Profile = lazy(() => import("../component/Profile"));
const CallHistory = lazy(() => import("../component/CallHistory"));
const CallModal = lazy(() => import("../component/CallModal"));
const GroupChatProfile = lazy(() => import("../component/GroupChatProfile"));
const MessageContainer = lazy(() => import("../component/MessageContainer"));

const Home = () => {
  const [isPopupOpen, setisPopupOpen] = useState(false);
  const searchRef = useRef(null);
  const [GroupCreation, setGroupCreation] = useState(false);
  const [isProfileActive, setisProfileActive] = useState(false);
  const [isCallHistoryOpen, setisCallHistoryOpen] = useState(false);
  const {
    selectedChat,
    selectedGroupMember,
    setselectedGroupMember,
    GroupName,
    setGroupName,
    isGroupChatProfileOpen,
    Notification,
    callHistory,
    callNotification,
    TrackSection,
    setTrackSection,
  } = useContext(chatContext);
  const [isOpenSearchUserModal, setisOpenSearchUserModal] = useState(false);
  const [searchInputValue, setsearchInputValue] = useState("");
  const [isGroupsOpen, setisGroupsOpen] = useState(false);
  const { User, isScoketConnected, setisScoketConnected, socketRef } =
    useContext(authContext);

  const navigate = useNavigate();

  function removeGroupCreate() {
    setGroupCreation((prev) => !prev);
  }
  function profileActivate() {
    setisProfileActive((prev) => !prev);
  }

  function handleSearch() {
    if (!searchRef.current.value || searchRef.current.value.trim() == "") {
      setsearchInputValue("");
      return;
    }
    setsearchInputValue(searchRef.current.value);
  }
  function handleInput() {
    setsearchInputValue("");
    setisOpenSearchUserModal(false);
  }

  useEffect(() => {
    if (!User) return;
    if (socketRef.current?.connected) return;
    socketRef.current = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
    socketRef.current.on("connect", () => {
      setisScoketConnected(true);
      socketRef.current.emit("setup", User);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [User]);

  function cleanUpSections() {
    if (isGroupsOpen) setisGroupsOpen(false);
    if (GroupCreation) setGroupCreation(false);
    if (isProfileActive) setisProfileActive(false);
    if (isCallHistoryOpen) setisCallHistoryOpen(false);
    if (selectedGroupMember.length > 0) {
      setselectedGroupMember([]);
      if (GroupName) setGroupName(null);
    }
  }

  return (
    <>
      <div className="h-[100dvh] flex flex-col bg-[#F7F5F3]">
        <Navabar profileActivate={profileActivate} />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
          <div
            className={`md:w-16 md:h-full bg-[#1D1F1F] text-white flex md:flex-col items-center md:relative py-4 absolute bottom-0 w-full h-24 justify-evenly ${selectedChat ? "hidden md:flex " : "flex"}`}
          >
            <div className="relative flex flex-col items-center gap-1">
              <div className="relative">
                {Notification.length > 0 && (
                  <span className="absolute -top-3 -right-2 md:-top-3 md:-right-2 bg-[#58B960] border-2 border-[#1D1F1F] z-12 font-bold text-black text-[11px] px-1  rounded-full">
                    {Notification.length}
                  </span>
                )}
                <div
                  className={`absolute h-8 w-16 md:h-8 md:w-10 md:rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D366]/20
          transition-transform duration-500
          ease-[cubic-bezier(.25,.8,.25,1)]
          ${
            TrackSection === "chat"
              ? "scale-x-100 scale-y-100 opacity-100"
              : "scale-x-[0.35] scale-y-[0.85] opacity-0"
          }`}
                />
                <BsChatSquareTextFill
                  size={20}
                  className="cursor-pointer relative z-10"
                  onClick={() => {
                    if (TrackSection != "chat") setTrackSection("chat");
                    cleanUpSections();
                    navigate("/");
                  }}
                />
              </div>
              <span className="md:hidden">Chats</span>
            </div>
            <div className="flex flex-col items-center ">
              <div className="relative">
                <div
                  className={`absolute h-8 w-16 w-16 md:h-8 md:w-10 md:rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D366]/20
          transition-transform duration-500
          ease-[cubic-bezier(.25,.8,.25,1)]
          ${
            TrackSection === "groups"
              ? "scale-x-100 scale-y-100 opacity-100"
              : "scale-x-[0.35] scale-y-[0.85] opacity-0"
          }`}
                />
                <MdGroup
                  size={20}
                  className="cursor-pointer relative z-10"
                  onClick={() => {
                    if (TrackSection != "groups") setTrackSection("groups");
                    cleanUpSections();
                    setisGroupsOpen(true);
                  }}
                />
              </div>
              <span className="md:hidden">Groups</span>
            </div>
            <div className="flex flex-col items-center ">
              <div className="relative">
                <div
                  className={`absolute h-8 w-16 w-16 md:h-8 md:w-10 md:rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D366]/20
          transition-transform duration-500
          ease-[cubic-bezier(.25,.8,.25,1)]
          ${
            TrackSection === "creategroup"
              ? "scale-x-100 scale-y-100 opacity-100"
              : "scale-x-[0.35] scale-y-[0.85] opacity-0"
          }`}
                />
                <MdOutlineGroupAdd
                  size={20}
                  onClick={() => {
                    if (TrackSection != "creategroup")
                      setTrackSection("creategroup");
                    cleanUpSections();
                    setGroupCreation((prev) => !prev);
                  }}
                  className="hover:cursor-pointer relative z-10"
                />
              </div>
              <span className="md:hidden">Create Group</span>
            </div>
            <div className="relative flex flex-col items-center ">
              <div className="relative">
                {callNotification?.length > 0 && (
                  <span className="absolute -top-3 -right-2 md:-top-3 md:-right-2 bg-[#58B960] border-2  border-[#1D1F1F] font-bold text-black text-[11px] px-1 z-12 rounded-full">
                    {callNotification?.length}
                  </span>
                )}
                <div
                  className={`absolute h-8 w-16 w-16 md:h-8 md:w-10 md:rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D366]/20
          transition-transform duration-500
          ease-[cubic-bezier(.25,.8,.25,1)]
          ${
            TrackSection === "calls"
              ? "scale-x-100 scale-y-100 opacity-100"
              : "scale-x-[0.35] scale-y-[0.85] opacity-0"
          }`}
                />
                <MdCall
                  size={20}
                  onClick={() => {
                    if (TrackSection != "calls") setTrackSection("calls");
                    cleanUpSections();
                    setisCallHistoryOpen((prev) => !prev);
                  }}
                  className={`hover:cursor-pointer relative z-10 `}
                />
              </div>
              <span className="md:hidden">Calls</span>
            </div>
          </div>

          {/* Chat List */}
          <Suspense fallback={<HomeSkeleton />}>
            {isCallHistoryOpen ? (
              <CallHistory />
            ) : isProfileActive ? (
              <Profile />
            ) : GroupCreation ? (
              <CreateGroup removeGroupCreate={removeGroupCreate} />
            ) : (
              <div className="flex w-full">
                {isGroupChatProfileOpen ? (
                  <GroupChatProfile />
                ) : (
                  <div
                    className={`md:w-[410px] flex-shrink-0 w-full bg-[#161717] text-white border-r border-black flex flex-col ${selectedChat ? "hidden md:flex " : "flex"}`}
                  >
                    <div className="flex justify-between items-center py-4 px-4 relative">
                      <h1 className="relative flex items-center text-3xl font-medium h-10">
                        {isOpenSearchUserModal && (
                          <button
                            className=" text-white h-10 w-10  flex items-center justify-center 
                              shadow-md active:scale-95 transition cursor-pointer"
                            onClick={handleInput}
                          >
                            <FaArrowLeft />
                          </button>
                        )}

                        <span
                          className={`transition-transform
                           duration-500 ease-out
                           ${isOpenSearchUserModal ? "translate-x-2" : "translate-x-0"}`}
                          style={{ willChange: "transform" }}
                        >
                          {isOpenSearchUserModal ? "All Users" : "Chats"}
                        </span>
                      </h1>
                      {!isOpenSearchUserModal && (
                        <span className="flex items-center gap-3 text-xl">
                          <RiChatNewFill
                            onClick={() => searchRef.current.focus()}
                            className="hover:cursor-pointer"
                          />
                          <BsThreeDotsVertical
                            onClick={() => setisPopupOpen((prev) => !prev)}
                            className="hover:cursor-pointer relative"
                          />
                          {isPopupOpen && (
                            <div className="absolute right-[9%] top-4 mt-4 z-50">
                              <div className="backdrop-blur-xl bg-black/90 text-white rounded-xl shadow-2xl py-2 w-52 border border-white/10 ring-1 ring-white/5">
                                <Link
                                  to=""
                                  className="block px-4 py-2 text-base hover:bg-white/10 transition"
                                >
                                  Read Messages
                                </Link>
                                <Link
                                  to=""
                                  className="block px-4 py-2 text-base hover:bg-white/10 transition"
                                >
                                  Unread Messages
                                </Link>
                                <Link
                                  to=""
                                  className="block px-4 py-2 text-base hover:bg-white/10 transition"
                                >
                                  Star Messages
                                </Link>
                              </div>
                            </div>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="mb-4 relative px-4 relative ">
                      <input
                        type="text"
                        name="Search"
                        className="bg-[#2E2F2F] w-full py-2 rounded-full pl-10 placeholder:text-[#9FACAC] focus:outline-none focus:ring-2 focus:ring-[#5CC064]"
                        placeholder="Search or start a new chat"
                        ref={searchRef}
                        onChange={handleSearch}
                        onFocus={() => setisOpenSearchUserModal(true)}
                        value={searchInputValue}
                      />
                      <FaSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 " />
                    </div>
                    {isOpenSearchUserModal ? (
                      <SearchUserModal
                        SearchValue={searchInputValue}
                        handleInput={handleInput}
                      />
                    ) : (
                      <UserList isGroupsOpen={isGroupsOpen} />
                    )}
                  </div>
                )}

                {selectedChat ? (
                  <MessageContainer />
                ) : (
                  <div className="hidden md:flex flex-1 bg-[#1D1F1F] text-white  items-center justify-center">
                    <motion.h1
                      className="text-3xl lg:text-5xl font-medium text-center px-4"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      Welcome buddy once again
                    </motion.h1>
                  </div>
                )}
              </div>
            )}
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<HomeSkeleton />}>
        <CallModal />
      </Suspense>
    </>
  );
};

export default Home;
