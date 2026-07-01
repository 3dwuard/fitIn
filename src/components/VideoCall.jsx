import { useState, useEffect, useRef } from "react";
import { useSession } from "../context/SessionContext";
import { supabase } from "../utils/supabaseClient";

function VideoCall({ requestId, receiverId }) {
  const { session } = useSession();
  const [callStatus, setCallStatus] = useState('idle');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [muted, setMuted] = useState(false);

  const sendOffer = async (pc) => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const { data: callData, error: callError } = await supabase
      .from('calls')
      .insert({
        request_id: Number(requestId),
        status: 'calling',
        offer: JSON.stringify(offer),
      });
    console.log('call insert data:', callData);
    console.log('call insert error:', callError);

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

    channel.send({
      type: 'broadcast',
      event: 'offer',
      payload: { offer: JSON.stringify(offer) }
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

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCallStatus('idle');
  };

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setMuted(!muted);
    }
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
      {(callStatus === 'connected' || callStatus === 'calling') && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button onClick={toggleMute} style={{ flex: 1, margin: '0', background: muted ? '#FF4444' : '#F7F9FA', color: muted ? 'white' : '#0A0A0A', border: '1px solid #E8ECEE', borderRadius: '8px', padding: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            {muted ? '🔇 Unmute' : '🎙️ Mute'}
          </button>
          <button onClick={endCall} style={{ flex: 1, margin: '0', background: '#FF4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            📵 End Call
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoCall;