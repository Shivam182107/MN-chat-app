import { useContext, useEffect, useRef, useState } from "react";
import { chatContext } from "../context/ChatContext";
import { authContext } from "../context/AuthContext";
import { getSenderDetails } from "../config/ChatLogic";
import IncomingCallModal from "./IncomingCallModal";
import AudioOnlyCall from "./AudioOnlyCall";
import VideoOnlyCall from "./VideoOnlyCall";

const ICE_SERVERS = {
  iceServers: [
    // Google STUN
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },

    // Metered TURN
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "59e39119bb96d93d0c5f5390",
      credential: "MDGAq6ct5hNPwUKu",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "59e39119bb96d93d0c5f5390",
      credential: "MDGAq6ct5hNPwUKu",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "59e39119bb96d93d0c5f5390",
      credential: "MDGAq6ct5hNPwUKu",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "59e39119bb96d93d0c5f5390",
      credential: "MDGAq6ct5hNPwUKu",
    },
  ],
};

const CALL_TIMEOUT_SECONDS = 60;

const CallModal = () => {
  const { socketRef, isScoketConnected, User } = useContext(authContext);
  //   const { selectedChat, callState, setCallState, incomingCall, setIncomingCall, callHistory, setCallHistory } = useContext(chatContext);
  const {
    selectedChat,
    callState,
    setCallState,
    incomingCall,
    setIncomingCall,
    callHistory,
    setCallHistory,
    startCallRef,
  } = useContext(chatContext);

  // ── WebRTC refs ───────────────────────────────────────────────────────────
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteIdRef = useRef("");
  const callStartTimeRef = useRef(null);
  const remoteStreamRef=useRef(null);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(0);
  const remoteAudioRef=useRef();

  // ── Refs for cleanup ─────────────────────────────────────────────────────
  const animFrameRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const timeoutCancelRef = useRef(null);

  // get other user's info from selectedChat
  const otherUser = selectedChat?.users?.find((u) => u._id !== User._id);

  // ── Speaking detection ───────────────────────────────────────────────────
  function startSpeakingDetection(stream) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    function check() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setIsSpeaking(avg > 10);
      animFrameRef.current = requestAnimationFrame(check);
    }
    check();
  }

  function stopSpeakingDetection() {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsSpeaking(false);
  }

  // ── History helper ───────────────────────────────────────────────────────
  function addToHistory(entry) {
    setCallHistory((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  }

  // ── Timeout ──────────────────────────────────────────────────────────────
  function startCallTimeout(receiverId) {
    setTimeoutCountdown(CALL_TIMEOUT_SECONDS);
    timeoutTimerRef.current = setInterval(() => {
      setTimeoutCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timeoutTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    timeoutCancelRef.current = setTimeout(() => {
      cancelCall(receiverId, true);
    }, CALL_TIMEOUT_SECONDS * 1000);
  }

  function clearCallTimeout() {
    if (timeoutTimerRef.current) clearInterval(timeoutTimerRef.current);
    if (timeoutCancelRef.current) clearTimeout(timeoutCancelRef.current);
    setTimeoutCountdown(0);
  }

  // ── Socket listeners for call events ────────────────────────────────────
  useEffect(() => {
    if (!isScoketConnected || !socketRef.current) return;

    // caller cancelled before we answered
    socketRef.current.on("call-cancelled", () => {
      setIncomingCall(null);
      setCallState("idle");
    });

    // our call got answered
    socketRef.current.on("call-answered", async ({ answer }) => {
      if (!peerRef.current) return;
      clearCallTimeout();
      callStartTimeRef.current = Date.now();
      setCallState("in-call");
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    });

    // ICE candidate
    socketRef.current.on("ice-candidate", async (candidate) => {
      if (!peerRef.current) return;
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error(e);
      }
    });

    // remote ended call
    socketRef.current.on("call-ended", () => {
      const duration = callStartTimeRef.current
        ? Math.round((Date.now() - callStartTimeRef.current) / 1000)
        : null;
      addToHistory({
        type: "incoming",
        status: "answered",
        remoteId: remoteIdRef.current,
        timestamp: new Date().toISOString(),
        duration,
      });
      cleanupCall();
    });

    // remote rejected
    socketRef.current.on("call-rejected", () => {
      clearCallTimeout();
      addToHistory({
        type: "outgoing",
        status: "rejected",
        remoteId: remoteIdRef.current,
        timestamp: new Date().toISOString(),
        duration: null,
      });
      cleanupCall();
    });

    return () => {
      socketRef.current.off("call-cancelled");
      socketRef.current.off("call-answered");
      socketRef.current.off("ice-candidate");
      socketRef.current.off("call-ended");
      socketRef.current.off("call-rejected");
    };
  }, [isScoketConnected]);

  // ── Get local stream ─────────────────────────────────────────────────────
  // Replace getLocalStream's setTimeout with a useEffect
  async function getLocalStream(withVideo) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: withVideo,
        audio: true,
      });
      localStreamRef.current = stream;
      // Remove the setTimeout — handle in useEffect below
      if (!withVideo) startSpeakingDetection(stream);
      return stream;
    } catch (e) {
      console.error("Media error:", e);
      alert("Media error: " + e.message);
      return null;
    }
  }

  // Add this useEffect to assign local video when the element is ready:
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [callState]); // re-runs when callState changes to "in-call" and video element renders

  // ── Create peer connection ────────────────────────────────────────────────
  function createPeerConnection(remoteId) {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    // peer.onicecandidate = (e) => {
    //   if (e.candidate)
    //     socketRef.current.emit("ice-candidate", remoteId, e.candidate);
    // };
    peer.onicecandidate = (e) => {
  if (e.candidate) {
    console.log("ICE candidate:", e.candidate.type, e.candidate.protocol);
    socketRef.current.emit("ice-candidate", remoteId, e.candidate);
  } else {
    console.log("ICE gathering complete");
  }
};
    peer.ontrack = (e) => {
      remoteStreamRef.current=e.streams[0];
      if (remoteVideoRef.current ){
        remoteVideoRef.current.srcObject = e.streams[0];
      }
      if (remoteAudioRef.current){
        remoteAudioRef.current.srcObject = e.streams[0];
      }
    };
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((t) => peer.addTrack(t, localStreamRef.current));
    }
    // peer.onconnectionstatechange = () => {
    //   if (
    //     peer.connectionState === "disconnected" ||
    //     peer.connectionState === "failed"
    //   )
    //     cleanupCall();
    // };
    peer.onconnectionstatechange = () => {
  console.log("Connection state:", peer.connectionState);
  if (peer.connectionState === "connected") {
    console.log("CONNECTED - media should be flowing now");
  }
  if (peer.connectionState === "disconnected" || peer.connectionState === "failed") {
    console.log("FAILED/DISCONNECTED - cleaning up");
    cleanupCall();
  }
};
    return peer;
  }
  // useEffect(()=>{
  //   if(callState=="in-call"&& remoteStreamRef.current){
  //     if(remoteVideoRef.current){
  //       remoteVideoRef.current.srcObject=remoteStreamRef.current
  //     }
  //     if(remoteAudioRef.current){
  //       remoteAudioRef.current.srcObject=remoteStreamRef.current
  //     }
  //   }
  // },[callState])

  useEffect(() => {
  if (callState === "in-call" && remoteStreamRef.current) {
    console.log("callState=in-call, re-assigning remoteStream");
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
      console.log("remoteVideoRef assigned via useEffect");
    } else {
      console.log("remoteVideoRef still NULL in useEffect");
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStreamRef.current;
      console.log("remoteAudioRef assigned via useEffect");
    } else {
      console.log("remoteAudioRef still NULL in useEffect");
    }
  }
}, [callState]);
  // ── INITIATE CALL ─────────────────────────────────────────────────────────
  // Called from MessageContainer when user clicks Voice/Video call button
  // withVideo: true = video call, false = audio only
  // receiverId: other user's MongoDB _id
  async function initiateCall(withVideo, receiverId, callerData) {
    const stream = await getLocalStream(withVideo);
    if (!stream) return;
    setIsAudioOnly(!withVideo);
    setCallState("calling");
    remoteIdRef.current = receiverId;
    const peer = createPeerConnection(receiverId);
    peerRef.current = peer;
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    // callerId = User._id (server will emit to this room to send answer back)
    socketRef.current.emit(
      "call-user",
      receiverId,
      User._id,
      offer,
      withVideo,
      callerData,
    );
    startCallTimeout(receiverId);
  }

  // ── CANCEL CALL ───────────────────────────────────────────────────────────
  function cancelCall(receiverId, timedOut = false) {
    clearCallTimeout();
    socketRef.current.emit("call-cancelled", receiverId, User._id);
    addToHistory({
      type: "outgoing",
      status: timedOut ? "no-answer" : "cancelled",
      remoteId: receiverId,
      timestamp: new Date().toISOString(),
      duration: null,
    });
    cleanupCall();
    // if (timedOut) alert("No answer. Call ended automatically.");
  }

  // ── ACCEPT CALL ───────────────────────────────────────────────────────────
  async function acceptCall(withVideo) {
    if (!incomingCall) return;
    const stream = await getLocalStream(withVideo);
    if (!stream) return;
    setIsAudioOnly(!withVideo);
    callStartTimeRef.current = Date.now();
    remoteIdRef.current = incomingCall.callerId;
    const peer = createPeerConnection(incomingCall.callerId);
    peerRef.current = peer;
    await peer.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer),
    );
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    // callerId here = the caller's _id, send answer back to them
    socketRef.current.emit("answer-call", incomingCall.callerId, answer);
    setCallState("in-call");
    setIncomingCall(null);
  }

  // ── REJECT CALL ───────────────────────────────────────────────────────────
  function rejectCall() {
    socketRef.current.emit("reject-call", incomingCall.callerId);
    addToHistory({
      type: "incoming",
      status: "rejected",
      remoteId: incomingCall.callerId,
      timestamp: new Date().toISOString(),
      duration: null,
    });
    setIncomingCall(null);
    setCallState("idle");
  }

  // ── END CALL ──────────────────────────────────────────────────────────────
  function endCall() {
    const duration = callStartTimeRef.current
      ? Math.round((Date.now() - callStartTimeRef.current) / 1000)
      : null;
    addToHistory({
      type: "outgoing",
      status: "answered",
      remoteId: remoteIdRef.current,
      timestamp: new Date().toISOString(),
      duration,
    });
    socketRef.current.emit("end-call", remoteIdRef.current);
    cleanupCall();
  }

  // ── CLEANUP ───────────────────────────────────────────────────────────────
  function cleanupCall() {
    stopSpeakingDetection();
    clearCallTimeout();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
      remoteStreamRef.current = null;
    callStartTimeRef.current = null;
    remoteIdRef.current = "";
    setCallState("idle");
    setIncomingCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsAudioOnly(false);
  }

  // ── Media toggles ─────────────────────────────────────────────────────────
  function toggleMute() {
    if (!localStreamRef.current) return;
    localStreamRef.current
      .getAudioTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((p) => !p);
  }

  function toggleVideo() {
    if (!localStreamRef.current) return;
    localStreamRef.current
      .getVideoTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setIsVideoOff((p) => !p);
  }

  // expose initiateCall so MessageContainer can call it via context
  // we attach it to context via callModalRef in ChatContext
  useEffect(() => {
    startCallRef.current = initiateCall;
  }, []);

  // don't render anything if idle and no incoming call
  if (callState === "idle" && !incomingCall) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm ${callState === "in-call" && "h-screen"} `}
    >
      <div
        className={
          callState === "in-call"
            ? "h-screen flex flex-col bg-[#F7F5F3] w-full"
            : "bg-black rounded-2xl shadow-2xl p-6 w-[90vw] max-w-[700px] text-white flex flex-col gap-4"
        }
      >
        {/* ── CALLING STATE ── */}
        {callState === "calling" && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-[#2a2a4a] flex items-center justify-center text-4xl animate-pulse">
              {otherUser?.pic ? (
                <img
                  src={otherUser.pic}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                "📞"
              )}
            </div>
            <p className="text-lg font-semibold">
              {otherUser?.fullname?.firstname || "Calling..."}
            </p>
            <p className="text-sm text-gray-400">
              Calling... auto-cancels in {timeoutCountdown}s
            </p>
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                style={{
                  width: `${(timeoutCountdown / CALL_TIMEOUT_SECONDS) * 100}%`,
                }}
              />
            </div>
            <button
              onClick={() => cancelCall(remoteIdRef.current, false)}
              className="mt-2 w-full py-3 cursor-pointer bg-red-600 rounded-[50px] text-sm font-medium hover:bg-red-700 transition"
            >
              Decline
            </button>
          </div>
        )}

        {/* ── INCOMING CALL STATE ── */}
        {callState === "incoming" && incomingCall && (
          <IncomingCallModal
            acceptCall={acceptCall}
            rejectCall={rejectCall}
            incomingCall={incomingCall}
          />
        )}

        {/* ── IN CALL STATE ── */}
        {callState === "in-call" && (
          <div className="flex flex-col gap-4 h-full ">
            {isAudioOnly ? (
              /* AUDIO ONLY UI */
              <AudioOnlyCall
                isSpeaking={isSpeaking}
                isMuted={isMuted}
                localUser={User}
                remoteUser={otherUser}
                toggleMute={toggleMute}
                toggleVideo={toggleVideo}
                endCall={endCall}
                remoteAudioRef={remoteAudioRef}
              />
            ) : (
              /* VIDEO UI */
              <VideoOnlyCall
                localVideoRef={localVideoRef}
                remoteVideoRef={remoteVideoRef}
                toggleMute={toggleMute}
                toggleVideo={toggleVideo} 
                endCall={endCall}
                isMuted={isMuted}
                isAudioOnly ={isAudioOnly }
                isVideoOff={isVideoOff}
                 remoteStreamRef={remoteStreamRef} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallModal;
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE initiateCall from MessageContainer:
// In MessageContainer, call: startCall(true/false, otherUser._id)
// startCall comes from chatContext
// ─────────────────────────────────────────────────────────────────────────────
