import { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { supabase } from "../utils/supabaseClient";
import Chat from "../components/Chat";

function AthleteDashboard() {
  const { session } = useSession();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedCoach, setAcceptedCoach] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, bio, email, avatar_url')
        .eq('role', 'coach');
      if (error) {
        console.log('error fetching coaches:', error);
      } else {
        setCoaches(data);
      }
      setLoading(false);
    };
    fetchCoaches();
  }, []);

  useEffect(() => {
    const fetchAcceptedCoach = async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('id, status, coach_id, profiles!requests_coach_id_fkey(name, email, bio, avatar_url)')
        .eq('athlete_id', session.user.id)
        .eq('status', 'accepted');
      if (error) {
        console.log('error', error);
      } else {
        setAcceptedCoach(data[0]);
      }
    };
    if (error) {
  console.log('error', error);
} else {
  console.log('accepted coach data:', data);
  console.log('my user id:', session.user.id);
  setAcceptedCoach(data[0]);
}
    fetchAcceptedCoach();
  }, []);

  const sendRequest = async (coachId) => {
    const { data: existing } = await supabase
      .from('requests')
      .select('id')
      .eq('athlete_id', session.user.id)
      .eq('coach_id', coachId)
      .maybeSingle();
    if (existing) {
      alert('You already sent a request to this coach');
      return;
    }
    const { error } = await supabase
      .from('requests')
      .insert({ athlete_id: session.user.id, coach_id: coachId, status: 'pending' });
    if (error) {
      alert(error.message);
    } else {
      alert('Request sent!');
    }
  };

  if (loading) return (
    <main style={{ margin: '0 auto', padding: '24px 24px 100px', width: '100%', maxWidth: '480px' }}>
      <p style={{ color: '#6B6B6B', textAlign: 'center' }}>Loading...</p>
    </main>
  );

  return (
    <main style={{ margin: '0 auto', padding: '24px 24px 120px', width: '100%', maxWidth: '480px' }}>

      {acceptedCoach && (
        <div style={{ background: '#E0FFFE', border: '2px solid #00E5FF', borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#007A8A', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 12px' }}>Your coach</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {acceptedCoach.profiles.avatar_url ? (
              <img src={acceptedCoach.profiles.avatar_url} alt={acceptedCoach.profiles.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00E5FF' }} />
            ) : (
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#007A8A' }}>
                {(acceptedCoach.profiles.name || acceptedCoach.profiles.email)[0].toUpperCase()}
              </div>
            )}
            <div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 2px' }}>{acceptedCoach.profiles.name || acceptedCoach.profiles.email}</p>
              <p style={{ fontSize: '12px', color: '#6B6B6B', margin: '0' }}>{acceptedCoach.profiles.bio || 'No bio yet'}</p>
            </div>
          </div>
          <Chat requestId={acceptedCoach.id} receiverId={acceptedCoach.coach_id} />
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#0A0A0A', marginBottom: '4px' }}>Find a coach</h1>
        <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Browse and connect with professional coaches</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {coaches.map((coach) => (
          <div key={coach.id} onClick={() => sendRequest(coach.id)} style={{ background: '#ffffff', border: '1.5px solid #E8ECEE', borderRadius: '16px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'border-color 0.2s' }}>
            {coach.avatar_url ? (
              <img src={coach.avatar_url} alt={coach.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00E5FF', flexShrink: '0' }} />
            ) : (
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E0FFFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#007A8A', flexShrink: '0' }}>
                {(coach.name || coach.email)[0].toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 4px' }}>{coach.name || coach.email}</p>
              <p style={{ fontSize: '12px', color: '#6B6B6B', margin: '0' }}>{coach.bio || 'No bio yet'}</p>
            </div>
            <span style={{ fontSize: '18px', color: '#00E5FF' }}>→</span>
          </div>
        ))}
        {coaches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#F7F9FA', borderRadius: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏃</div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 4px' }}>No coaches yet</p>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0' }}>Check back soon</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default AthleteDashboard;