import React, { useContext } from "react";
import ChatWindow from "./ChatWindow";
import { BiSolidPhoneIncoming, BiSolidPhoneOutgoing } from "react-icons/bi";
import { chatContext } from "../context/ChatContext";
import { useEffect } from "react";
import api from "../api/axiosInterceptor";
import { formatDateLabel, formatDuration } from "../config/ChatLogic";
import { authContext } from "../context/AuthContext";

const statusColor = {
  answered: "text-[#5DC164]",
  rejected: "text-red-500",
  cancelled: "text-yellow-500",
  "no-answer": "text-orange-400",
};

const CallHistory = () => {
  const {
    callHistory,
    setCallHistory,
    fetchCallHistoryAgain,
    setfetchCallHistoryAgain,
  } = useContext(chatContext);
  const { User } = useContext(authContext);

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

  return (
    <>
      <div className="md:w-[410px] flex-shrink-0 w-full bg-[#161717] text-white flex flex-col">
        {/* Header */}
        <div className="p-4">
          <h1 className="text-2xl font-medium">Calls</h1>
        </div>

        {/* Call List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar pb-28 pl-2 w-full">
          {callHistory.length === 0 && (
            <div className="p-4 bg-[#161717] flex flex-col justify-center rounded-lg items-center mt-4">
              <div className="text-4xl mb-2">📞</div>

              <h3 className="text-center text-sm sm:text-base">
                You have no call records yet.
              </h3>

              <h4 className="text-center mt-2 text-gray-500 text-sm">
                Start a call and your history will appear here
              </h4>

              <p className="text-center mt-1 text-gray-600 text-xs">
                Have a great day! ✨
              </p>
            </div>
          )}
          {callHistory.length > 0 &&
            callHistory.map((item) => {
              const isOutgoing = item.callerid._id === User._id;

              const name = isOutgoing
                ? item.receiverid?.fullname?.firstname
                : item.callerid?.fullname?.firstname;
              const pic =isOutgoing
                ? item.receiverid?.pic
                : item.callerid?.pic;
              return (
                <div
                  key={item._id}
                  className="p-3 bg-[#161717] flex rounded items-center hover:bg-[#2E2F2F] cursor-pointer transition"
                >
                  {/* Avatar */}
                  <div
                    className="rounded-[50%] w-12 flex items-center"
                    style={{
                      border:
                        !item.groupPic && item.isGroupChat
                          ? "1px solid black"
                          : "",
                    }}
                  >
                    <img
                      src={
                        item.isGroupChat
                          ? item.groupPic || "/GroupDefaultImage.png"
                          : pic
                      }
                      alt=""
                      loading="lazy"
                      className="w-full rounded-[50%]"
                    />
                  </div>

                  {/* User Info */}
                  <div className="w-full pl-2 flex flex-col justify-center overflow-hidden">
                    <p className="text-sm truncate">{name}</p>

                    <div className="flex items-center gap-1">
                      {isOutgoing ? (
                        <BiSolidPhoneOutgoing
                          size={13}
                          className={statusColor[item.status]}
                        />
                      ) : (
                        <BiSolidPhoneIncoming
                          size={13}
                          className={statusColor[item.status]}
                        />
                      )}

                      <span
                        className={`text-xs capitalize ${statusColor[item.status]}`}
                      >
                        {item.status}
                      </span>

                      <span className="text-xs text-[#ABACAC]">
                        • {item.callType}
                      </span>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex flex-col items-end justify-center gap-1">
                    <p className="text-[#ABACAC] text-xs">
                      {formatDateLabel(item.createdAt)}
                    </p>

                    {item.duration && (
                      <span className="text-[#ABACAC] text-[11px]">
                        {formatDuration(item.duration)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <ChatWindow />
    </>
  );
};

export default CallHistory;
