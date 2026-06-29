function FooterNav() {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1a1a1a', borderTop: '2px solid #00E5FF' }}>
      <button
        onClick={() => window.history.back()}
        style={{ width: '44px', height: '44px', borderRadius: '10px', border: '2px solid #00E5FF', background: 'transparent', color: '#00E5FF', cursor: 'pointer', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0', padding: '0' }}
      >
        ←
      </button>
      <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', letterSpacing: '-0.5px' }}>
        FIT<span style={{ color: '#00E5FF' }}>IN</span>
      </div>
      <button
        onClick={() => window.history.forward()}
        style={{ width: '44px', height: '44px', borderRadius: '10px', border: '2px solid #00E5FF', background: 'transparent', color: '#00E5FF', cursor: 'pointer', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0', padding: '0' }}
      >
        →
      </button>
    </div>
  );
}
export default FooterNav;