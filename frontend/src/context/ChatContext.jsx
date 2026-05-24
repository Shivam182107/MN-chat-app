// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { authContext } from "./AuthContext";
// import api from "../api/axiosInterceptor";
// export const chatContext = createContext();
// const ChatContext = ({ children }) => {
//   const [chatDetails, setchatDetails] = useState(null);
//   const [selectedChat, setselectedChat] = useState(null);
//   const [fetchChatAgain, setfetchChatAgain] = useState(false);
//   const [groupMemberList, setgroupMemberList] = useState(null);
//   const [groupMemberArray, setgroupMemberArray] = useState(null);
//   const [selectedGroupMember, setselectedGroupMember] = useState([]);
//   const [isGroupChatProfileOpen, setisGroupChatProfileOpen] = useState(false);
//   const [GroupName, setGroupName] = useState(null);
//   const [UserMessages, setUserMessages] = useState([]);
//   const [Notification, setNotification] = useState([]);
//   const { User, isScoketConnected, socketRef } = useContext(authContext);
//   const currentChatRef = useRef();

//   useEffect(() => {
//     if (!User || groupMemberList) return;
//     getAllUser();
//   }, [User, groupMemberList]);
//   async function getAllUser() {
//     try {
//       const usersResponse = await api.get("/user/all");
//       if (usersResponse.status === 200) {
//         setgroupMemberList(usersResponse.data);
//       }
//     } catch (e) {
//       console.log(e);
//       console.log(e.message);
//     }
//   }

//   useEffect(() => {
//     if (
//       !groupMemberList ||
//       groupMemberList?.length === 0 ||
//       !chatDetails ||
//       chatDetails?.length === 0 ||
//       !User
//     ) {
//       return;
//     }
//     const users = chatDetails
//       .map((val) => !val.isGroupChat && val.users)
//       .filter(Boolean)
//       .flat();
//     console.log("Computed again");
//     // console.log(users)
//     // console.log("inside group ")
//     const userArray = groupMemberList.filter((val) => {
//       return !users.some((item) => item._id === val._id);
//     });
//     setgroupMemberArray(userArray);
//   }, [groupMemberList, chatDetails, User?._id]);

//   useEffect(() => {
//     currentChatRef.current = selectedChat;
//   }, [selectedChat]);
//   useEffect(() => {
//     if (!isScoketConnected || !socketRef.current) return;

//     const handleMessageRecieve = function (message) {

//       if (
//         !currentChatRef.current ||
//         currentChatRef.current?._id != message.chat._id
//       ) {
//         setNotification((prev) => {
//           return !prev.some((val) => val._id === message._id)
//             ? [message, ...prev]
//             : prev;
//         });
//         setfetchChatAgain(true);
//       } else {
//         setUserMessages((prev) => [...prev, message]);
//       }
//     };
//     socketRef.current.on("message recieved", handleMessageRecieve);
//     return () => {
//       socketRef.current.off("message recieved", handleMessageRecieve);
//     };
//   }, [isScoketConnected]);
//   return (
//     <>
//       <chatContext.Provider
//         value={{
//           chatDetails,
//           setchatDetails,
//           selectedChat,
//           setselectedChat,
//           fetchChatAgain,
//           setfetchChatAgain,
//           groupMemberList,
//           setgroupMemberList,
//           groupMemberArray,
//           selectedGroupMember,
//           setselectedGroupMember,
//           GroupName,
//           setGroupName,
//           isGroupChatProfileOpen,
//           setisGroupChatProfileOpen,
//           UserMessages,
//           setUserMessages,
//           Notification,
//           setNotification,
//         }}
//       >
//         {children}
//       </chatContext.Provider>
//     </>
//   );
// };

// export default ChatContext;

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { authContext } from "./AuthContext";
import api from "../api/axiosInterceptor";
export const chatContext = createContext();

const ChatContext = ({ children }) => {
  const [chatDetails, setchatDetails] = useState(null);
  const [selectedChat, setselectedChat] = useState(null);
  const [fetchChatAgain, setfetchChatAgain] = useState(false);
  const [groupMemberList, setgroupMemberList] = useState(null);
  const [groupMemberArray, setgroupMemberArray] = useState(null);
  const [selectedGroupMember, setselectedGroupMember] = useState([]);
  const [isGroupChatProfileOpen, setisGroupChatProfileOpen] = useState(false);
  const [GroupName, setGroupName] = useState(null);
  const [UserMessages, setUserMessages] = useState([]);
  const [Notification, setNotification] = useState([]);

  // ── CALL STATE (new) ──────────────────────────────────────────────────────
  const [callState, setCallState] = useState("idle"); // idle | calling | incoming | in-call
  const [incomingCall, setIncomingCall] = useState(null); // { callerId, offer }
  const [callHistory, setCallHistory] = useState([]);
  // startCall is set by CallModal so MessageContainer can trigger a call
  const startCallRef = useRef(null);
  function startCall(withVideo, receiverId,callerData) {
  console.log("startCall called, ref=", startCallRef.current); // add this
  if (startCallRef.current) startCallRef.current(withVideo, receiverId,callerData);
}
  // ─────────────────────────────────────────────────────────────────────────

  const { User, isScoketConnected, socketRef } = useContext(authContext);
  const currentChatRef = useRef();

  useEffect(() => {
    if (!User || groupMemberList) return;
    getAllUser();
  }, [User, groupMemberList]);

  async function getAllUser() {
    try {
      const usersResponse = await api.get("/user/all");
      if (usersResponse.status === 200) setgroupMemberList(usersResponse.data);
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    if (!groupMemberList?.length || !chatDetails?.length || !User) return;
    const users = chatDetails.map((val) => !val.isGroupChat && val.users).filter(Boolean).flat();
    const userArray = groupMemberList.filter((val) => !users.some((item) => item._id === val._id));
    setgroupMemberArray(userArray);
  }, [groupMemberList, chatDetails, User?._id]);

  useEffect(() => {
    currentChatRef.current = selectedChat;
  }, [selectedChat]);

  // ── message received listener ─────────────────────────────────────────────
  useEffect(() => {
    if (!isScoketConnected || !socketRef.current) return;
    const handleMessageRecieve = function (message) {
      if (!currentChatRef.current || currentChatRef.current?._id != message.chat._id) {
        setNotification((prev) => !prev.some((val) => val._id === message._id) ? [message, ...prev] : prev);
        setfetchChatAgain(true);
      } else {
        setUserMessages((prev) => [...prev, message]);
      }
    };
    socketRef.current.on("message recieved", handleMessageRecieve);
    return () => { socketRef.current.off("message recieved", handleMessageRecieve); };
  }, [isScoketConnected]);

  // ── incoming call listener ────────────────────────────────────────────────
  useEffect(() => {
    if (!isScoketConnected || !socketRef.current) return;
    const handleIncomingCall = ({ offer, callerId,withVideo,callerData}) => {
      setIncomingCall({ offer, callerId,withVideo,callerData });
      setCallState("incoming");
    };
    // missed calls delivered on connect
    const handleMissedCalls = (calls) => {
      setCallHistory((prev) => [
        ...calls.map((c) => ({
          id: Date.now() + Math.random(),
          type: "incoming",
          status: "missed",
          remoteId: c.callerId,
          timestamp: c.timestamp,
          duration: null,
        })),
        ...prev,
      ]);
    };
    socketRef.current.on("incomming-call", handleIncomingCall);
    socketRef.current.on("missed-calls", handleMissedCalls);
    return () => {
      socketRef.current.off("incomming-call", handleIncomingCall);
      socketRef.current.off("missed-calls", handleMissedCalls);
    };
  }, [isScoketConnected]);

  return (
    <chatContext.Provider
      value={{
        chatDetails, setchatDetails,
        selectedChat, setselectedChat,
        fetchChatAgain, setfetchChatAgain,
        groupMemberList, setgroupMemberList,
        groupMemberArray,
        selectedGroupMember, setselectedGroupMember,
        GroupName, setGroupName,
        isGroupChatProfileOpen, setisGroupChatProfileOpen,
        UserMessages, setUserMessages,
        Notification, setNotification,
        // ── call (new) ──
        callState, setCallState,
        incomingCall, setIncomingCall,
        callHistory, setCallHistory,
        startCall,
        startCallRef,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export default ChatContext;