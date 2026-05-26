import React, { useEffect, useState } from "react";
import { TbSwitch3 } from "react-icons/tb";

const VideoOnlyCall = ({
  localVideoRef,
  remoteVideoRef,
  toggleMute,
  toggleVideo,
  endCall,
  isMuted,
  isAudioOnly,
  isVideoOff,
   remoteStreamRef
}) => {
  const [SwapVideoSides, setSwapVideoSide] = useState(false);
  useEffect(()=>{
    if(remoteStreamRef?.current&& remoteVideoRef.current){
      remoteVideoRef.current.srcObject=remoteStreamRef.current
    }
  },[])

  return (
    <>
      <div className="flex h-full w-full  border-2 transition-all duration-150 bg-black">
        <div
          className={`md:w-[410px] h-full flex-shrink-0 w-full bg-[#161717] text-white border-r border-black flex flex-col justify-center items-center relative  `} //${selectedChat ? "hidden md:flex " : "flex"}
          style={{ background: "#0d0e0eff", borderRight: "1px solid #2E2F2F" }}
        >
          <p className="text-xs text-gray-400 mb-1">You</p>
          <video
            ref={SwapVideoSides ? remoteVideoRef : localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full rounded-xl object-cover bg-black"
          />

          {/* mobile view of  remote  call video  */}
          <div
            className="h-[200px] w-[100px] md:hidden absolute bottom-12 right-4 "
            style={{
              background: "#0d0e0eff",
              borderRight: "1px solid #2E2F2F",
            }}
          >
            
            <video
              ref={SwapVideoSides ? localVideoRef : remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full rounded-xl object-cover bg-black"
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={toggleMute}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              {isMuted ? "🔇 Unmute" : "🎤 Mute"}
            </button>
            {!isAudioOnly && (
              <button
                onClick={toggleVideo}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {isVideoOff ? "📵 Start Video" : "📹 Stop Video"}
              </button>
            )}
            <button
              onClick={endCall}
              className="px-5 py-2 bg-red-600 rounded-full text-sm font-medium hover:bg-red-700 transition"
            >
              📴 End Call
            </button>
            <button
              className="px-5 py-2 bg-gay-700 hover:bg-gray-600 rounded-full text-sm font-medium hover:bg-red-700 transition"
              onClick={() => {
                setSwapVideoSide((prev) => !prev);
              }}
            >
              <TbSwitch3 />
            </button>
          </div>
        </div>
        <div
          className="flex-1 md:flex hidden flex-col items-center justify-center gap-3 relative"
          style={{ background: "#0d0e0eff", borderRight: "1px solid #2E2F2F" }}
        >
          <p className="text-xs text-gray-400 mb-1">Remote</p>
          <video
            ref={SwapVideoSides ? localVideoRef : remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full rounded-xl object-cover bg-black"
          />
        </div>
      </div>
    </>
  );
};

export default VideoOnlyCall;
