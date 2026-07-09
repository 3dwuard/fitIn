import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <main style={{ margin: '0 auto', padding: '48px 24px 120px', width: '100%', maxWidth: '480px' }}>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-block', background: '#E0FFFE', color: '#007A8A', fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', marginBottom: '16px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          About
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', color: '#0A0A0A', marginBottom: '12px' }}>
          What is <span style={{ color: '#00E5FF' }}>FitIn</span>?
        </h1>
        <p style={{ fontSize: '15px', color: '#6B6B6B', lineHeight: '1.6' }}>
          FitIn is a coaching marketplace that connects athletes with professional coaches. Find your coach, get matched, and train with real-time chat, file sharing and video calls — all in one place.
        </p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
          How it works
        </p>
        {[
          { step: '01', title: 'Create your profile', desc: 'Sign up as a coach or athlete. Add your photo, bio and goals, and connect.' },
          { step: '02', title: 'Find your training coach', desc: 'Athletes find the best coach profiles and send a training request.' },
          { step: '03', title: 'Train together', desc: 'Chat in real time, share videos, photos of your training, and have personal video calls.' },
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

      <div style={{ background: '#F7F9FA', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
          Built with
        </p>
        <p style={{ fontSize: '13px', color: '#0A0A0A', lineHeight: '1.8', margin: '0' }}>
          React · Vite · Supabase · WebRTC · Vercel
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '12px' }}>
          By J.Eduardo Contreras L.
        </p>
        <a
          href="https://github.com/3dwuard/fitIn"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', width: 'auto', padding: '8px 20px', fontSize: '13px' }}
        >
          View on GitHub
        </a>
      </div>

    </main>
  );
};

export default AboutPage;