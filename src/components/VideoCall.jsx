import { useState, useEffect, useRef } from "react";
import { useSession } from "../context/SessionContext";
import { supabase } from "../utils/supabaseClient";

function VideoCall({ requestId, receiverId }) {
  const { session } = useSession();
  const [callStatus, setCallStatus] = useState('idle');
  const [userRole, setUserRole] = useState(null);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      console.log('user role fetched:', data?.role);
      if (data) setUserRole(data.role);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`call-incoming-${requestId}-${session.user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'calls',
        filter: `request_id=eq.${requestId}`
      }, (payload) => {
        console.log('new call detected:', payload.new);
        if (payload.new.offer && payload.new.caller_id !== session.user.id) {
          setIncomingOffer(JSON.parse(payload.new.offer));
          setCallStatus('incoming');
        }
      })
      .subscribe((status) => {
        console.log('incoming call channel status', status);
      });

    return () => supabase.removeChannel(channel);
  }, [requestId]);

  const sendOffer = async (pc) => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const { data: callData, error: callError } = await supabase
      .from('calls')
      .insert({
        request_id: Number(requestId),
        status: 'calling',
        offer: JSON.stringify(offer),
        caller_id: session.user.id,
      })
      .select();
    console.log('call insert data:', callData);
    console.log('call insert error:', callError);

    const answerChannel = supabase.channel(`call-answer-${requestId}`);

    const pendingCandidates = [];
    let remoteDescriptionSet = false;

    answerChannel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
      const answer = JSON.parse(payload.answer);
      await pc.setRemoteDescription(answer);
      remoteDescriptionSet = true;

      for (const candidate of pendingCandidates) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      pendingCandidates.length = 0;

      setCallStatus('connected');
    });

    answerChannel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
      const candidate = JSON.parse(payload.candidate);
      if (remoteDescriptionSet) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        pendingCandidates.push(candidate);
      }
    });

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        answerChannel.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { candidate: JSON.stringify(candidate) }
        });
      }
    };

    answerChannel.subscribe();
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

    const answerChannel = supabase.channel(`call-answer-${requestId}`);

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        answerChannel.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { candidate: JSON.stringify(candidate) }
        });
      }
    };

    answerChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        answerChannel.send({
          type: 'broadcast',
          event: 'answer',
          payload: { answer: JSON.stringify(answer) }
        });
      }
    });
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

  const acceptCall = async () => {
    setCallStatus('calling');
    await receiveCall(incomingOffer);
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject = null;
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

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <video ref={localVideoRef} autoPlay muted style={{ width: '48%', borderRadius: '8px', background: '#000' }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: '48%', borderRadius: '8px', background: '#000' }} />
      </div>

      {callStatus === 'idle' && userRole === 'coach' && (
        <button onClick={startCall} style={{ width: '100%', margin: '0', background: '#00E5FF', color: '#003D47', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: '600', cursor: 'pointer' }}>
          📹 Start Video Call
        </button>
      )}

      {callStatus === 'incoming' && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <p style={{ color: '#6B6B6B', fontSize: '13px', flex: 1, margin: '0' }}>📹 Incoming call...</p>
          <button onClick={acceptCall} style={{ background: '#00E5FF', color: '#003D47', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', width: 'auto', margin: '0', fontWeight: '600' }}>
            Accept
          </button>
          <button onClick={() => setCallStatus('idle')} style={{ background: '#FF4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', width: 'auto', margin: '0', fontWeight: '600' }}>
            Decline
          </button>
        </div>
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