import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  const [TrackSection,setTrackSection]=useState("chat");

  // ── CALL STATE (new) ──────────
  const [callState, setCallState] = useState("idle");
  const [incomingCall, setIncomingCall] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [fetchCallHistoryAgain, setfetchCallHistoryAgain] = useState(false);

  const startCallRef = useRef(null);
  function startCall(withVideo, receiverId, callerData) {
    // console.log("startCall called, ref=", startCallRef.current); // add this
    if (startCallRef.current)
      startCallRef.current(withVideo, receiverId, callerData);
  }

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
    const users = chatDetails
      .map((val) => !val.isGroupChat && val.users)
      .filter(Boolean)
      .flat();
    const userArray = groupMemberList.filter(
      (val) => !users.some((item) => item._id === val._id),
    );
    setgroupMemberArray(userArray);
  }, [groupMemberList, chatDetails, User?._id]);

  useEffect(() => {
    currentChatRef.current = selectedChat;
  }, [selectedChat]);

  // ── message received listener ──────────
  useEffect(() => {
    if (!isScoketConnected || !socketRef.current) return;
    const handleMessageRecieve = async function (message) {
      if (
        !currentChatRef.current ||
        currentChatRef.current?._id != message.chat._id
      ) {
        setNotification((prev) =>
          !prev.some((val) => val._id === message._id)
            ? [message, ...prev]
            : prev,
        );
        setfetchChatAgain(true);
      } else {
        setUserMessages((prev) => [...prev, message]);
      }
    };
    socketRef.current.on("message recieved", handleMessageRecieve);
    return () => {
      socketRef.current.off("message recieved", handleMessageRecieve);
    };
  }, [isScoketConnected]);

  // ── incoming call listener ─────
  useEffect(() => {
    if (!isScoketConnected || !socketRef.current) return;
    const handleIncomingCall = ({ offer, callerId, withVideo, callerData }) => {
      setIncomingCall({ offer, callerId, withVideo, callerData });
      setCallState("incoming");
    };
    // missed calls delivered on connect
    const handleCallHistoryUpdate = () => {
      setfetchCallHistoryAgain(true);
    };

    socketRef.current.on("incomming-call", handleIncomingCall);
    socketRef.current.on("call-history-update", handleCallHistoryUpdate);
    return () => {
      socketRef.current.off("incomming-call", handleIncomingCall);
      socketRef.current.off("call-history-update", handleCallHistoryUpdate);
    };
  }, [isScoketConnected]);

  let callNotification = useMemo(() => {
    if (callHistory.length === 0) return [];
    return callHistory.filter((val) => {
      return (
        val.receiverid._id === User._id &&
        (val.status === "no-answer" || val.status === "cancelled") &&
        !val.isUserVisited
      );
    });
  }, [callHistory]);
    async function getCallHistory() {
    try {
      const History = await api.get("/history");
      if (History.status === 200) {
        setCallHistory(History.data.history);
      }
      setfetchCallHistoryAgain(false);
    } catch (error) {
      console.log("Failed to fetch on mount:", error);
    }
  }
  useEffect(() => {
    if (!fetchCallHistoryAgain) return;
    getCallHistory();
  }, [fetchCallHistoryAgain]);

    const notificationMap=useMemo(()=>{
    const map={};
    Notification.forEach((val)=>{
      const chatid=val.chat._id;
      if(!map[chatid])map[chatid]={ count: 0, date: val.createdAt };
      map[chatid].count+=1;
    })
    return map; 
  },[Notification]);

  //memoize the delete notification function 
  const handleDeleteNotification =useCallback(async (chatid) => {
    try {
      const response = await api.delete(`/notification/${chatid}`);
      if (response.status === 200) {
        setNotification((prev) => prev.filter((item) => item.chat._id !== chatid));
      }
    } catch (error) {
      console.log("Notification deletion failed:", error);
    }
  },[setNotification]);
  return (
    <chatContext.Provider
      value={{
        chatDetails,
        setchatDetails,
        selectedChat,
        setselectedChat,
        fetchChatAgain,
        setfetchChatAgain,
        groupMemberList,
        setgroupMemberList,
        groupMemberArray,
        selectedGroupMember,
        setselectedGroupMember,
        GroupName,
        setGroupName,
        isGroupChatProfileOpen,
        setisGroupChatProfileOpen,
        UserMessages,
        setUserMessages,
        Notification,
        setNotification,
        callState,
        setCallState,
        incomingCall,
        setIncomingCall,
        callHistory,
        setCallHistory,
        startCall,
        startCallRef,
        fetchCallHistoryAgain,
        setfetchCallHistoryAgain,
        callNotification,
        TrackSection,setTrackSection,
        notificationMap,
        handleDeleteNotification

      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export default ChatContext;
