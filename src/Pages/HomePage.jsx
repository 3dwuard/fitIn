import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useSession } from "../context/SessionContext";

const HomePage = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  return (
    <main style={{ marginTop: '0', padding: '0', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      
      {/* Hero section */}
      <div style={{ padding: '48px 24px 32px' }}>
        <div style={{ display: 'inline-block', background: '#E0FFFE', color: '#007A8A', fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', marginBottom: '20px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          Find your coach
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-1px', color: '#0A0A0A', marginBottom: '16px' }}>
          Train with the<br />
          <span style={{ color: '#00E5FF' }}>best coaches</span>
        </h1>
        <p style={{ fontSize: '15px', color: '#6B6B6B', lineHeight: '1.6', marginBottom: '32px' }}>
          Connect with professional coaches. Get matched and start training today.
        </p>

        {session ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ width: '100%', margin: '0' }}>
              Go to dashboard
            </button>
            <button onClick={() => supabase.auth.signOut()} style={{ width: '100%', margin: '0', background: 'transparent', color: '#6B6B6B', border: '1px solid #E8ECEE' }}>
              Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/auth/sign-up" style={{ width: '100%', margin: '0' }}>
              Get started
            </Link>
            <Link to="/auth/sign-in" style={{ width: '100%', margin: '0', background: 'transparent', color: '#0A0A0A', border: '1px solid #E8ECEE' }}>
              Sign in
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '0 24px 32px' }}>
        {[
          { num: '240+', label: 'Coaches' },
          { num: '1.2k', label: 'Athletes' },
          { num: '98%', label: 'Match rate' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#F7F9FA', borderRadius: '12px', padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0A0A0A' }}>{stat.num}</div>
            <div style={{ fontSize: '11px', color: '#6B6B6B', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ padding: '0 24px 40px' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
          How it works
        </p>
        {[
          { step: '01', title: 'Create your profile', desc: 'Sign up as a coach or athlete in minutes.' },
          { step: '02', title: 'Find your match', desc: 'Browse coaches and send a request.' },
          { step: '03', title: 'Start training', desc: 'Chat, schedule calls, and achieve your goals.' },
        ].map((item) => (
          <div key={item.step} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E0FFFE', color: '#007A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0' }}>
              {item.step}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 4px' }}>{item.title}</p>
              <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
};

export default HomePage;