const AudioOnlyCall = ({
  isSpeaking,
  isMuted,
  localUser,
  remoteUser,
  toggleMute,
  toggleVideo,
  endCall,
  remoteAudioRef
}) => {
  return (
    <div className="flex h-full w-full  border-2 transition-all duration-150 bg-black">
      {/* ── Left panel: YOU (mirrors the UserList sidebar style) ── */}
      <div
        className={`md:w-[410px] h-full flex-shrink-0 w-full bg-[#161717] text-white border-r border-black flex flex-col justify-center items-center `} //${selectedChat ? "hidden md:flex " : "flex"}
        style={{ background: "#0d0e0eff", borderRight: "1px solid #2E2F2F" }}
      >
        <span className="absolute top-3 left-4 text-xs text-[#9FACAC] uppercase tracking-widest font-medium">
          You
        </span>

        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-200"
          style={{
            background: "#2E2F2F",
            border: `3px solid ${isSpeaking && !isMuted ? "#4caf50" : "#2E2F2F"}`,
            boxShadow:
              isSpeaking && !isMuted
                ? "0 0 0 10px rgba(76,175,80,0.18)"
                : "none",
          }}
        >
          {localUser?.pic ? (
            <img
              src={localUser.pic}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            "🎤"
          )}
        </div>

        <p className="text-white text-sm font-medium mt-4">
          {localUser?.fullname?.firstname || "You"}
        </p>

        <span
          className="text-xs px-3 py-1 rounded-full mt-3"
          style={
            isMuted
              ? { background: "#3a1a1a", color: "#f87171" }
              : isSpeaking
                ? { background: "#14301c", color: "#4caf50" }
                : { background: "#1e293b", color: "#60a5fa" }
          }
        >
          {isMuted
            ? "🔇 Muted"
            : isSpeaking
              ? "🟢 Speaking..."
              : "🔵 Connected"}
        </span>

        {/* mobile view of remotw audio call ui  */}
        <div
          className="flex-1 md:hidden flex  flex-col items-center justify-center gap-3 h-[200px] w-[100px] absolute bottom-12 right-4"
          style={{ background: "#0d0e0eff", borderRight: "1px solid #2E2F2F" }}
        >

          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-200"
            style={{
              background: "#e5e7eb",
              border: `3px solid ${isSpeaking && !isMuted ? "#4caf50" : "#2E2F2F"}`,
              boxShadow:
                isSpeaking && !isMuted
                  ? "0 0 0 10px rgba(76,175,80,0.18)"
                  : "none",
            }}
          >
            {remoteUser?.pic ? (
              <img
                src={remoteUser.pic}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              "🎤"
            )}
          </div>

          <p className="text-white text-sm font-medium ">
            {remoteUser?.fullname?.firstname || "Remote"}
          </p>

          <span
            className="text-xs px-3 py-1 rounded-full "
            style={
              isMuted
                ? { background: "#3a1a1a", color: "#f87171" }
                : isSpeaking
                  ? { background: "#14301c", color: "#4caf50" }
                  : { background: "#1e293b", color: "#60a5fa" }
            }
          >
            {isMuted
              ? "🔇 Muted"
              : isSpeaking
                ? "🟢 Speaking..."
                : "🔵 Connected"}
          </span>
          
        </div>
        {/* Controls */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={toggleMute}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
          >
            {isMuted ? "🔇 Unmute" : "🎤 Mute"}
          </button>

          <button
            onClick={endCall}
            className="px-5 py-2 bg-red-600 rounded-full text-sm font-medium hover:bg-red-700 transition"
          >
            📴 End Call
          </button>
        </div>
      </div>

      {/* ── Right panel: REMOTE (mirrors the Welcome/main container style) ── */}
      <div
        className="flex-1 md:flex hidden flex-col items-center justify-center gap-3 relative"
        style={{ background: "#0d0e0eff", borderRight: "1px solid #2E2F2F" }}
      >
        <span className="absolute top-3 left-4 text-xs text-gray-400 uppercase tracking-widest font-medium">
          Remote
        </span>

        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-200"
          style={{
            background: "#e5e7eb",
            border: `3px solid ${isSpeaking && !isMuted ? "#4caf50" : "#2E2F2F"}`,
            boxShadow:
              isSpeaking && !isMuted
                ? "0 0 0 10px rgba(76,175,80,0.18)"
                : "none",
          }}
        >
          {remoteUser?.pic ? (
            <img
              src={remoteUser.pic}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            "🎤"
          )}
        </div>

        <p className="text-white text-sm font-medium ">
          {remoteUser?.fullname?.firstname || "Remote"}
        </p>

        <span
          className="text-xs px-3 py-1 rounded-full "
          style={
            isMuted
              ? { background: "#3a1a1a", color: "#f87171" }
              : isSpeaking
                ? { background: "#14301c", color: "#4caf50" }
                : { background: "#1e293b", color: "#60a5fa" }
          }
        >
          {isMuted
            ? "🔇 Muted"
            : isSpeaking
              ? "🟢 Speaking..."
              : "🔵 Connected"}
        </span>
      </div>
        <audio ref={remoteAudioRef} autoPlay playsInline />
    </div>
  );
};

export default AudioOnlyCall;
