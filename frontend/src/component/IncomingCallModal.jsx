import React, { useContext } from "react";
import { MdCallEnd } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { IoMdVideocam } from "react-icons/io";
import { authContext } from "../context/AuthContext";

const IncomingCallModal = ({
  acceptCall,
  rejectCall,
  incomingCall,
}) => {

  return (
    <>
      {/* ── INCOMING CALL STATE ── */}

      <div className="flex flex-col items-center gap-0 w-full bg-black">
        {/* Top info */}
        <div className="flex flex-col items-center gap-2 py-8 w-full">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 mb-2">
            {incomingCall.callerData?.pic ? (
              <img src={incomingCall.callerData.pic} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#2a2a4a] flex items-center justify-center text-4xl">
                👤
              </div>
            )}
          </div>
          <p className="text-xl font-bold tracking-wide">
            {incomingCall.callerData?.fullname?.firstname || incomingCall.callerId}
          </p>
          <p className="text-sm text-gray-400">
            {incomingCall.withVideo ? "Video Call" : "Audio call"}
          </p>
        </div>

        {/* Preview box (dark camera area like whatsapp) */}
        {incomingCall.withVideo&&<div className="w-full h-44 bg-[#111] rounded-xl flex items-center justify-center mb-6">
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <span className="text-4xl">📷</span>
            <span className="text-xs">Camera preview</span>
          </div>
        </div>}

        {/* Action buttons */}
        <div className="flex items-center w-full gap-2  ">
          {incomingCall.withVideo ? (
            <div className="flex w-[80%] ">
              {/* Accept video */}
              <button
                onClick={() => acceptCall(true)}
                className="w-full  bg-green-500 py-4 rounded-[50px] flex justify-center gap-2 hover:bg-green-600 flex items-center justify-center transition shadow-lg"
              >
                <span className="text-2xl">
                  <IoMdVideocam className="text-black " />
                </span>
                <span className="text-sm font-bold text-black">Accept</span>
              </button>
            </div>
          ) : (
            <div className="flex w-[80%]">
              {/* Audio only */}
              <button
                onClick={() => acceptCall(false)}
                className="w-full  bg-green-500 py-4 rounded-[50px] flex justify-center gap-2 hover:bg-green-600 flex items-center justify-center transition shadow-lg"
              >
                <span className="text-2xl">
                  <IoMdCall className="text-black" />
                </span>
                <span className="text-sm font-bold  text-black">Accept</span>
              </button>
            </div>
          )}

          {/* Decline */}
          <div className=" flex w-[20%]   ">
            <button
              onClick={rejectCall}
              className=" w-full rounded-[50px] py-4  bg-red-500 hover:bg-red-600 flex items-center justify-center transition shadow-lg"
            >
              <span className="text-2xl">
                <MdCallEnd />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IncomingCallModal;
