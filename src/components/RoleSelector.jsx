import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useSession } from '../context/SessionContext';

export default function RoleSelector() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const saveRole = async (role) => {
    setSelected(role);
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', session.user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    if (role === 'coach') navigate('/coach-onboarding');
    if (role === 'athlete') navigate('/athlete-onboarding');
  };

  return (
    <main style={{ margin: '0 auto', padding: '48px 24px', width: '100%', maxWidth: '480px' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#0A0A0A', marginBottom: '8px' }}>
          Who are you?
        </h1>
        <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Choose your role to continue</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div
          onClick={() => !loading && saveRole('coach')}
          style={{
            padding: '24px',
            borderRadius: '16px',
            border: selected === 'coach' ? '2px solid #00E5FF' : '1.5px solid #E8ECEE',
            background: selected === 'coach' ? '#E0FFFE' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏋️</div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', marginBottom: '6px' }}>I am a Coach</h2>
          <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0' }}>Create your profile, share your experience and connect with athletes looking for guidance.</p>
        </div>

        <div
          onClick={() => !loading && saveRole('athlete')}
          style={{
            padding: '24px',
            borderRadius: '16px',
            border: selected === 'athlete' ? '2px solid #00E5FF' : '1.5px solid #E8ECEE',
            background: selected === 'athlete' ? '#E0FFFE' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏃</div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', marginBottom: '6px' }}>I am an Athlete</h2>
          <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0' }}>Browse coaches, send requests and get personalized training from professionals.</p>
        </div>

      </div>

      {loading && <p style={{ textAlign: 'center', marginTop: '24px', color: '#6B6B6B', fontSize: '14px' }}>Saving...</p>}
      {error && <p style={{ textAlign: 'center', marginTop: '16px', color: 'red', fontSize: '14px' }}>{error}</p>}

    </main>
  );
}