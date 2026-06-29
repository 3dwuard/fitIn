import { supabase } from "../utils/supabaseClient";
import { useSession } from "../context/SessionContext";
import { useState, useEffect } from "react";
import Chat from "../components/Chat";

function CoachDashboard() {
  const { session } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('id, status, athlete_id, profiles!requests_athlete_id_fkey(name, email, bio, avatar_url)')
        .eq('coach_id', session.user.id)
        .in('status', ['pending', 'accepted']);
      if (error) {
        console.log('error fetching requests:', JSON.stringify(error));
      } else {
        setRequests(data);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const updateStatus = async (requestId, newStatus) => {
    const { error } = await supabase
      .from('requests')
      .update({ status: newStatus })
      .eq('id', requestId);
    if (error) {
      alert(error.message);
    } else {
      setRequests(requests.filter((req) => req.id !== requestId));
    }
  };

  if (loading) return (
    <main style={{ margin: '0 auto', padding: '24px 24px 100px', width: '100%', maxWidth: '480px' }}>
      <p style={{ color: '#6B6B6B', textAlign: 'center' }}>Loading...</p>
    </main>
  );

  return (
    <main style={{ margin: '0 auto', padding: '24px 24px 120px', width: '100%', maxWidth: '480px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#0A0A0A', marginBottom: '4px' }}>
          Your athletes
        </h1>
        <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Manage requests and conversations</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {requests.map((req) => (
          <div key={req.id} style={{ background: '#ffffff', border: '1.5px solid #E8ECEE', borderRadius: '16px', padding: '16px', overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              {req.profiles.avatar_url ? (
                <img src={req.profiles.avatar_url} alt={req.profiles.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00E5FF' }} />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E0FFFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#007A8A' }}>
                  {(req.profiles.name || req.profiles.email)[0].toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 2px' }}>{req.profiles.name || req.profiles.email}</p>
                <p style={{ fontSize: '12px', color: '#6B6B6B', margin: '0' }}>{req.profiles.bio || 'No bio yet'}</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{ background: req.status === 'accepted' ? '#E0FFFE' : '#F7F9FA', color: req.status === 'accepted' ? '#007A8A' : '#6B6B6B', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {req.status}
                </span>
              </div>
            </div>

            {req.status === 'pending' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => updateStatus(req.id, 'accepted')} style={{ flex: 1, margin: '0', height: '38px', fontSize: '13px', borderRadius: '8px' }}>
                  Accept
                </button>
                <button onClick={() => updateStatus(req.id, 'declined')} style={{ flex: 1, margin: '0', height: '38px', fontSize: '13px', borderRadius: '8px', background: 'transparent', color: '#0A0A0A', border: '1px solid #E8ECEE' }}>
                  Decline
                </button>
              </div>
            )}

            {req.status === 'accepted' && (
              <Chat requestId={req.id} receiverId={req.athlete_id} />
            )}
          </div>
        ))}
        {requests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#F7F9FA', borderRadius: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏋️</div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 4px' }}>No requests yet</p>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0' }}>Athletes will appear here when they send you a request</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default CoachDashboard;