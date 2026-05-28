import React, { useEffect, useRef, useState } from "react";
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
  remoteStreamRef,
}) => {
  const [SwapVideoSides, setSwapVideoSide] = useState(false);
  const mobileLocalRef = useRef(null);
  const mobileRemoteRef = useRef(null);

  useEffect(() => {
    if(mobileLocalRef.current && localVideoRef?.current){
      mobileLocalRef.current.srcObject=localVideoRef.current
    }
    if(mobileRemoteRef.current && remoteStreamRef?.current){
      mobileRemoteRef.current.srcObject=remoteStreamRef.current
    }
    if (remoteStreamRef?.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, []);

  return (
    <>
      <div className="flex h-full w-full border-2 transition-all duration-150 bg-black">
        {/* ── Mobile layout: full screen remote, local pip ── */}
        <div className="md:hidden relative w-full h-full">
          {/* Remote video — full screen on mobile */}
          <video
            ref={mobileLocalRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover bg-black"
          />

          {/* Local video — small pip top-right on mobile */}
          <div className="absolute top-4 right-4 w-28 h-40 rounded-xl overflow-hidden border border-gray-600 shadow-lg">
            <video
              ref={mobileRemoteRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-black"
            />
          </div>

          {/* Controls — bottom center on mobile */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4">
            <button
              onClick={toggleMute}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              {isMuted ? "🔇" : "🎤"}
            </button>
            {!isAudioOnly && (
              <button
                onClick={toggleVideo}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {isVideoOff ? "📵" : "📹"}
              </button>
            )}
            <button
              onClick={endCall}
              className="px-4 py-2 bg-red-600 rounded-full text-sm font-medium hover:bg-red-700 transition"
            >
              📴
            </button>
            <button
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-medium transition"
              onClick={() => setSwapVideoSide((prev) => !prev)}
            >
              <TbSwitch3 />
            </button>
          </div>
        </div>

        {/* ── Desktop layout: left = you, right = remote ── */}
        <div
          className="hidden md:flex md:w-[410px] h-full flex-shrink-0 text-white flex-col justify-center items-center relative"
          style={{ background: "#0d0e0eff", borderRight: "1px solid #2E2F2F" }}
        >
          <p className="text-xs text-gray-400 mb-1">You</p>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full rounded-xl object-cover bg-black"
          />

          {/* Controls — desktop */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 flex-wrap px-2">
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
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-medium transition"
              onClick={() => setSwapVideoSide((prev) => !prev)}
            >
              <TbSwitch3 />
            </button>
          </div>
        </div>

        {/* Right panel: remote — desktop only */}
        <div
          className="hidden md:flex flex-1 flex-col items-center justify-center gap-3 relative"
          style={{ background: "#0d0e0eff" }}
        >
          <p className="text-xs text-gray-400 mb-1">Remote</p>
          <video
            ref={remoteVideoRef}
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
