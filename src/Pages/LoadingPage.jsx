const LoadingPage = () => {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #E0FFFE', borderTop: '3px solid #00E5FF', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: '16px', fontSize: '14px', color: '#6B6B6B' }}>Loading...</p>
    </main>
  );
};

export default LoadingPage;