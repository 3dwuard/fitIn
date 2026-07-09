import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { supabase } from "../utils/supabaseClient";

function Navbar () {
const { session } = useSession();
const navigate = useNavigate();
const [menuOpen, setMenuOpen] = useState(false);
if (!session) return null;

return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#2a2a2a', borderBottom: '2px solid #00E5FF' }}>

      <div onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: 'white', letterSpacing: '-0.5px' }}>
      FIT<span style={{ color: '#00E5FF' }}>IN</span>
      </div>

      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', width: 'auto' }}>
          ☰
        </button>

        {menuOpen && (
          <div style={{ position: 'absolute', right: 0, top: '100%', background: '#2a2a2a', border: '1px solid #4a4a4a', borderRadius: '8px', padding: '0.5rem', minWidth: '150px', zIndex: 100 }}>
            <p style={{ color: '#aaa', fontSize: '12px', padding: '0.5rem' }}>{session.user.email}</p>
            <button onClick={() => { navigate('/about'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>
              About
            </button>
            <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>
              Dashboard
            </button>
            <button onClick={() => { alert('Payments coming soon!'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>
              💳 Payments
            </button>
            <button onClick={() => { navigate('/edit-profile'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>
            Edit Profile
            </button>
            <button onClick={() => { supabase.auth.signOut(); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'red', padding: '0.5rem', cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}


export default Navbar;
