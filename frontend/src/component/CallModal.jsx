import { useContext, useEffect, useRef, useState } from "react";
import { chatContext } from "../context/ChatContext";
import { authContext } from "../context/AuthContext";
import IncomingCallModal from "./IncomingCallModal";
import AudioOnlyCall from "./AudioOnlyCall";
import VideoOnlyCall from "./VideoOnlyCall";
import api from "../api/axiosInterceptor";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
  ],
};

const CALL_TIMEOUT_SECONDS = 60;

const CallModal = () => {
  const { socketRef, isScoketConnected, User } = useContext(authContext);
  const {
    selectedChat,
    callState,
    setCallState,
    incomingCall,
    setIncomingCall,
    startCallRef,
    setfetchCallHistoryAgain,
  } = useContext(chatContext);

  // ──────── WebRTC refs ────────
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteIdRef = useRef("");
  const callStartTimeRef = useRef(null);
  const remoteStreamRef = useRef(null);

  // ────── UI state ────────────
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(0);
  const remoteAudioRef = useRef();
  const iceCandidateBuffer = useRef([]);
  const [IsRemoteUserMuted, setIsRemoteUserMuted] = useState(false);
  const callWithVideoRef = useRef(false);
  const isCallerRef = useRef(false);

  // ──────────── Refs for cleanup ─────────
  const animFrameRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const timeoutCancelRef = useRef(null);

  // get other user's info from selectedChat
  const otherUser = selectedChat?.users?.find((u) => u._id !== User._id);

  // ──────── Speaking detection ──────────
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

  // ──────── History helper ────
  async function addToHistory(entry) {
    try {
      const response = await api.post("/history", entry);
      if (response.status === 201) {
        setfetchCallHistoryAgain(true);
      }
    } catch (error) {
      console.log("Failed to save call history:", error);
      // console.log(error)
    }
  }

  // ─ Timeout ──────────────────
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

    // our call got answered means call connected
    socketRef.current.on("call-answered", async ({ answer }) => {
      if (!peerRef.current) return;
      clearCallTimeout();
      callStartTimeRef.current = Date.now();

      try {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );

        for (let i of iceCandidateBuffer.current) {
          try {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(i));
          } catch (e) {
            console.error("flush error:", e);
          }
        }
        iceCandidateBuffer.current = [];
        setCallState("in-call");
      } catch (e) {
        console.log("call-answered error:", e);
      }
    });

    // ICE candidate
    socketRef.current.on("ice-candidate", async (candidate) => {
      if (!peerRef.current || !peerRef.current.remoteDescription) {
        iceCandidateBuffer.current.push(candidate);
        return;
      }
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("ICE error:", e);
      }
    });

    // remote ended call call receiverid
    socketRef.current.on("call-ended", () => {
      cleanupCall();
    });

    // remote rejected caller side
    socketRef.current.on("call-rejected", () => {
      clearCallTimeout();
      cleanupCall();
    });
    socketRef.current.on("remote-user-muted", (isMute) => {
      setIsRemoteUserMuted(isMute);
    });

    return () => {
      socketRef.current.off("call-cancelled");
      socketRef.current.off("call-answered");
      socketRef.current.off("ice-candidate");
      socketRef.current.off("call-ended");
      socketRef.current.off("call-rejected");
      socketRef.current.off("remote-user-muted");
    };
  }, [isScoketConnected]);

  // ── Get local stream ────────────────
  // Replace getLocalStream's setTimeout with a useEffect
  async function getLocalStream(withVideo) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: withVideo,
        audio: true,
      });
      localStreamRef.current = stream;

      if (!withVideo) startSpeakingDetection(stream);
      return stream;
    } catch (e) {
      alert("Media error: " + e.message);
      return null;
    }
  }

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [callState]);

  // ── Create peer connection ─────────────
  function createPeerConnection(remoteId) {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("ice-candidate", remoteId, e.candidate);
      }
    };
    peer.ontrack = (e) => {
      remoteStreamRef.current = e.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = e.streams[0];
      }
    };
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((t) => peer.addTrack(t, localStreamRef.current));
    }

    peer.onconnectionstatechange = () => {
      if (
        peer.connectionState === "disconnected" ||
        peer.connectionState === "failed"
      ) {
        cleanupCall();
      }
    };
    return peer;
  }

  useEffect(() => {
    if (callState === "in-call" && remoteStreamRef.current) {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStreamRef.current;
      }
    }
  }, [callState]);

  async function initiateCall(withVideo, receiverId, callerData) {
    const stream = await getLocalStream(withVideo);
    if (!stream) return;
    isCallerRef.current = true;
    setIsAudioOnly(!withVideo);
    setCallState("calling");
    remoteIdRef.current = receiverId;
    const peer = createPeerConnection(receiverId);
    peerRef.current = peer;
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socketRef.current.emit(
      "call-user",
      receiverId,
      User._id,
      offer,
      withVideo,
      callerData,
    );
    startCallTimeout(receiverId);
    callWithVideoRef.current = withVideo;
  }

  // ── CANCEL CALL ────── //it will handle missed call as well
  async function cancelCall(receiverId, timedOut = false) {
    clearCallTimeout();
    await addToHistory({
      callerid: User._id,
      receiverid: receiverId,
      Type: "outgoing",
      status: timedOut ? "no-answer" : "cancelled",
      callType: callWithVideoRef.current ? "video" : "audio",
      withVideo: callWithVideoRef.current,
      duration: null,
    });
    socketRef.current.emit("call-cancelled", receiverId, User._id);

    cleanupCall();
    // if (timedOut) alert("No answer. Call ended automatically.");
  }

  // ── ACCEPT CALL ───
  async function acceptCall(withVideo) {
    if (!incomingCall) return;
    const stream = await getLocalStream(withVideo);
    if (!stream) return;
    isCallerRef.current = false;
    setIsAudioOnly(!withVideo);
    callStartTimeRef.current = Date.now();
    remoteIdRef.current = incomingCall.callerId;
    const peer = createPeerConnection(incomingCall.callerId);
    peerRef.current = peer;
    await peer.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer),
    );

    for (let i of iceCandidateBuffer.current) {
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(i));
      } catch (e) {
        console.error(e);
      }
    }
    iceCandidateBuffer.current = [];
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socketRef.current.emit("answer-call", incomingCall.callerId, answer);
    callWithVideoRef.current = withVideo;
    setCallState("in-call");
    setIncomingCall(null);
  }

  // ── REJECT CALL ─────────  call receiver reject call 'shivam call subrat and subrat click end call button'
  function rejectCall() {
    socketRef.current.emit("reject-call", incomingCall.callerId);
    addToHistory({
      callerid: incomingCall.callerId,
      receiverid: User._id,
      Type: "incoming",
      status: "rejected",
      callType: incomingCall.withVideo ? "video" : "audio",
      withVideo: incomingCall.withVideo,
      duration: null,
    });
    setIncomingCall(null);
    setCallState("idle");
  }

  // ── END CALL ─────── caller side 'shivam call subrat and shivam click end call button'
  function endCall() {
    const duration = callStartTimeRef.current
      ? Math.round((Date.now() - callStartTimeRef.current) / 1000)
      : null;

    if (isCallerRef.current) {
      addToHistory({
        callerid: User._id,
        receiverid: remoteIdRef.current,
        Type: "outgoing",
        status: "answered",
        callType: callWithVideoRef.current ? "video" : "audio",
        withVideo: callWithVideoRef.current,
        duration,
      });
    } else {
      addToHistory({
        callerid: remoteIdRef.current,
        receiverid: User._id,
        Type: "incoming",
        status: "answered",
        callType: callWithVideoRef.current ? "video" : "audio",
        withVideo: callWithVideoRef.current,
        duration,
      });
    }
    socketRef.current.emit("end-call", remoteIdRef.current);
    cleanupCall();
  }

  // ── CLEANUP ───
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
    iceCandidateBuffer.current = [];
    remoteIdRef.current = "";
    callWithVideoRef.current = false;
    isCallerRef.current = false;
    setCallState("idle");
    setIncomingCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsAudioOnly(false);
    setIsRemoteUserMuted(false);
  }

  // ── Media toggles ────
  function toggleMute() {
    if (!localStreamRef.current) return;
    localStreamRef.current
      .getAudioTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((p) => {
      socketRef.current.emit("remote-mute", !p, remoteIdRef.current);
      return !p;
    });
  }

  function toggleVideo() {
    if (!localStreamRef.current) return;
    localStreamRef.current
      .getVideoTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setIsVideoOff((p) => !p);
  }

  useEffect(() => {
    startCallRef.current = initiateCall;
  }, []);

  if (callState === "idle" && !incomingCall) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm  `}
    >
      <div
        className={
          callState === "in-call"
            ? "h-[100dvh] flex flex-col bg-[#F7F5F3] w-full"
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
                IsRemoteUserMuted={IsRemoteUserMuted}
                localUser={User}
                remoteUser={otherUser}
                toggleMute={toggleMute}
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
                isAudioOnly={isAudioOnly}
                isVideoOff={isVideoOff}
                remoteStreamRef={remoteStreamRef}
                localStreamRef={localStreamRef}
                IsRemoteUserMuted={IsRemoteUserMuted}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallModal;
