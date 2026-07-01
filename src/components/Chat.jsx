import { useSession } from "../context/SessionContext";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import VideoCall from "./VideoCall.jsx";

function Chat({ requestId, receiverId }) {
  const { session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const [ showVideoCall, setShowVideoCall ] = useState(false);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('id, content, sender_id, created_at, is_file')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });
    if (error) {
      console.log('error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
  }, [requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages-${requestId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `request_id=eq.${requestId}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  const sendMessage = async () => {
    if (!newMessages.trim()) return;
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: session.user.id,
        receiver_id: receiverId,
        request_id: requestId,
        content: newMessages,
      });
    if (error) {
      console.log('error sending message:', error);
    } else {
      setNewMessages("");
    }
  };

  const sendFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${requestId}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(fileName, file);
    if (uploadError) {
      console.log('upload error:', uploadError);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from('chat-files')
      .getPublicUrl(fileName);
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: session.user.id,
        receiver_id: receiverId,
        request_id: requestId,
        content: urlData.publicUrl,
        is_file: true,
      });
    if (error) {
      console.log('error sending file:', error);
    }
    setUploading(false);
  };

  return (
    <div style={{ marginTop: '1rem', border: '1px solid #E8ECEE', borderRadius: '12px', overflow: 'hidden', background: '#ffffff' }}>
      
      <div style={{ height: '240px', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            alignSelf: msg.sender_id === session.user.id ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
          }}>
            {msg.is_file ? (
              msg.content.match(/\.(mp4|mov|avi|webm)$/i) ? (
                <video src={msg.content} controls style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px' }} />
              ) : (
                <img src={msg.content} alt="attachment" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover' }} />
              )
            ) : (
              <div style={{
                background: msg.sender_id === session.user.id ? '#00E5FF' : '#F7F9FA',
                color: msg.sender_id === session.user.id ? '#003D47' : '#0A0A0A',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontSize: '14px'
              }}>
                {msg.content}
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && <p style={{ color: '#6B6B6B', textAlign: 'center', fontSize: '13px' }}>No messages yet. Say hello!</p>}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderTop: '1px solid #E8ECEE', alignItems: 'center' }}>
        <label style={{ cursor: 'pointer', color: '#007A8A', fontSize: '20px', margin: '0', padding: '0 4px', background: 'none', border: 'none', width: 'auto', height: 'auto', display: 'flex', alignItems: 'center' }}>
        📎
        <input type="file" accept="image/*,video/*" onChange={sendFile} style={{ display: 'none' }} disabled={uploading} />
        </label>

        <button
          onClick={() => setShowVideoCall(!showVideoCall)}
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', width: 'auto', height: 'auto', padding: '0 4px', margin: '0', color: showVideoCall ? '#00E5FF' : '#007A8A' }}
          >
         📹
        </button>
        
        <input
          type="text"
          placeholder={uploading ? "Uploading..." : "Type a message..."}
          value={newMessages}
          onChange={(e) => setNewMessages(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: '#F7F9FA', border: '1px solid #E8ECEE', color: '#0A0A0A', margin: '0' }}
          disabled={uploading}
        />
        <button onClick={sendMessage} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#00E5FF', color: '#003D47', border: 'none', cursor: 'pointer', width: 'auto', margin: '0', fontWeight: '600' }}>
          Send
        </button>
      </div>
      {showVideoCall && (
      <VideoCall requestId={requestId} receiverId={receiverId} />
      )}
    </div>
  );
}

export default Chat;