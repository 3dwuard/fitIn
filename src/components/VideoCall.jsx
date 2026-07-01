import { useState, useEffect, useRef } from "react";
import { useSession } from "../context/SessionContext";
import { supabase } from "../utils/supabaseClient";

function VideoCall({ requestId, receiverId }) {
  const { session } = useSession();
  const [callStatus, setCallStatus] = useState('idle');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const sendOffer = async (pc) => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await supabase
      .from('calls')
      .insert({
        request_id: requestId,
        status: 'calling',
        offer: JSON.stringify(offer),
      });

    const channel = supabase.channel(`call-${requestId}`);

    channel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
      const answer = JSON.parse(payload.answer);
      await pc.setRemoteDescription(answer);
      setCallStatus('connected');
    });

    channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
      await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(payload.candidate)));
    });

    channel.subscribe();

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        channel.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { candidate: JSON.stringify(candidate) }
        });
      }
    };
  };

  const receiveCall = async (offer) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    localVideoRef.current.srcObject = stream;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnectionRef.current = pc;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = ({ streams }) => {
      remoteVideoRef.current.srcObject = streams[0];
      setCallStatus('connected');
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    const channel = supabase.channel(`call-${requestId}`);

    channel.send({
      type: 'broadcast',
      event: 'answer',
      payload: { answer: JSON.stringify(answer) }
    });

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        channel.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { candidate: JSON.stringify(candidate) }
        });
      }
    };

    channel.subscribe();
  };

  const startCall = async () => {
    setCallStatus('calling');

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    localVideoRef.current.srcObject = stream;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnectionRef.current = pc;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = ({ streams }) => {
      remoteVideoRef.current.srcObject = streams[0];
    };

    await sendOffer(pc);
  };

  useEffect(() => {
    const channel = supabase.channel(`call-incoming-${requestId}`);

    channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
      const offer = JSON.parse(payload.offer);
      await receiveCall(offer);
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <video ref={localVideoRef} autoPlay muted style={{ width: '48%', borderRadius: '8px', background: '#000' }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: '48%', borderRadius: '8px', background: '#000' }} />
      </div>
      {callStatus === 'idle' && (
        <button onClick={startCall} style={{ width: '100%', margin: '0', background: '#00E5FF', color: '#003D47', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: '600', cursor: 'pointer' }}>
          📹 Start Video Call
        </button>
      )}
      {callStatus === 'calling' && (
        <p style={{ textAlign: 'center', color: '#6B6B6B', fontSize: '13px' }}>Connecting...</p>
      )}
      {callStatus === 'connected' && (
        <p style={{ textAlign: 'center', color: '#00E5FF', fontSize: '13px', fontWeight: '600' }}>● Live</p>
      )}
    </div>
  );
}

export default VideoCall;