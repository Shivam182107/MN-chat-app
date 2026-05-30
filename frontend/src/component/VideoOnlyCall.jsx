import React, { useEffect, useRef, useState } from "react";
import { TbSwitch3 } from "react-icons/tb";
import { BsFillCameraVideoOffFill } from "react-icons/bs";
import { FaVideo } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { AiOutlineAudioMuted } from "react-icons/ai";

import { GoUnmute } from "react-icons/go";

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
  localStreamRef,
  IsRemoteUserMuted,
  remoteUser
}) => {
  
  const mobileLocalRef = useRef(null);
  const mobileRemoteRef = useRef(null);

  useEffect(() => {
    if (mobileLocalRef.current && localStreamRef?.current) {
      mobileLocalRef.current.srcObject = localStreamRef.current;
    }
    if (mobileRemoteRef.current && remoteStreamRef?.current) {
      mobileRemoteRef.current.srcObject = remoteStreamRef.current;
    }
    if (remoteStreamRef?.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, []);

  function handleSwapVideoSides() {
    const mobileLocal = mobileLocalRef.current.srcObject;
    const mobileRemote = mobileRemoteRef.current.srcObject;
    if (mobileLocalRef.current && mobileRemoteRef.current) {
      mobileLocalRef.current.srcObject = mobileRemote;
      mobileRemoteRef.current.srcObject = mobileLocal;
    }
    const desktopLocal = localVideoRef.current.srcObject;
    const desktopRemote = remoteVideoRef.current.srcObject;
    if (localVideoRef.current && remoteVideoRef.current) {
      localVideoRef.current.srcObject = desktopRemote;
      remoteVideoRef.current.srcObject = desktopLocal;
    }
  }
  return (
    <>
      <div className="flex h-full w-full border-2 transition-all duration-150 bg-black gap-2">
        <div className="md:hidden relative w-full h-full">
          <video
            ref={mobileLocalRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover bg-black"
          />

          <div className="absolute top-4 right-4 w-28 h-40 rounded-xl overflow-hidden border border-gray-600 shadow-lg">
            <video
              ref={mobileRemoteRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-black"
            />
            {IsRemoteUserMuted && (
              <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "#3a1a1a", color: "#f87171" }}
                >
                  <AiOutlineAudioMuted /> Muted
                </span>
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4">
            <button
              onClick={toggleMute}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              {isMuted ? (
                <span className="flex justify-center items-center gap-1">
                  <GoUnmute /> UnMute
                </span>
              ) : (
                <span className="flex justify-center items-center gap-1">
                  <AiOutlineAudioMuted /> Mute
                </span>
              )}
            </button>

            {!isAudioOnly && (
              <button
                onClick={toggleVideo}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {isVideoOff ? <BsFillCameraVideoOffFill /> : <FaVideo />}
              </button>
            )}
            <button
              onClick={endCall}
              className="px-5 py-2 bg-red-600 rounded-full font-medium hover:bg-red-700 transition"
            >
              <MdCallEnd size={20} />
            </button>
            <button
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-medium transition"
              onClick={handleSwapVideoSides}
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
          {/* <p className="text-xs text-gray-400 mb-1">You</p> */}
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
              {isMuted ? (
                <span className="flex justify-center items-center gap-1">
                  <GoUnmute /> UnMute
                </span>
              ) : (
                <span className="flex justify-center items-center gap-1">
                  <AiOutlineAudioMuted /> Mute
                </span>
              )}
            </button>
            {!isAudioOnly && (
              <button
                onClick={toggleVideo}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {isVideoOff ? <FaVideo /> : <BsFillCameraVideoOffFill />}
              </button>
            )}
            <button
              onClick={endCall}
              className="px-5 py-2 bg-red-600 rounded-full font-medium hover:bg-red-700 transition"
            >
              <MdCallEnd size={20} />
            </button>
            <button
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-medium transition"
              onClick={handleSwapVideoSides}
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
          {/* <p className="text-xs text-gray-400 mb-1">Remote</p> */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full rounded-xl object-cover bg-black"
          />
          {IsRemoteUserMuted && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <span
                className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full"
                style={{ background: "#3a1a1a", color: "#f87171" }}
              >
                <AiOutlineAudioMuted /> {remoteUser?.fullname?.firstname || "Remote"} is muted
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoOnlyCall;
