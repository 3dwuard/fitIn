import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main style={{ margin: '0 auto', padding: '80px 24px', width: '100%', maxWidth: '480px', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏁</div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#0A0A0A', marginBottom: '8px' }}>Page not found</h1>
      <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '32px' }}>Looks like you took a wrong turn.</p>
      <Link to="/" style={{ display: 'inline-flex', width: 'auto', padding: '0 24px' }}>Go home</Link>
    </main>
  );
};

export default NotFoundPage;