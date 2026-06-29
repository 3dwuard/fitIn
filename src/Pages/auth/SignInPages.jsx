import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { supabase } from "../../utils/supabaseClient";

const SignInPage = () => {
  const { session } = useSession();
  const [status, setStatus] = useState("");
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [ showPassword, setShowPassword ] = useState(false);

  if (session) return <Navigate to="/dashboard" />;

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({
      email: formValues.email,
      password: formValues.password,
    });
    if (error) {
      alert(error.message);
    } else {
      navigate("/dashboard");
    }
    setStatus("");
  };

  return (
    <main style={{ marginTop: '0', padding: '48px 24px 0', width: '100%', maxWidth: '480px', margin: '0 auto' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#0A0A0A', marginBottom: '8px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Sign in to continue your training</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#0A0A0A', display: 'block', marginBottom: '6px' }}>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={handleInputChange}
            style={{ width: '100%', margin: '0' }}
          />
        </div>

        <div>
         <label style={{ fontSize: '13px', fontWeight: '500', color: '#0A0A0A', display: 'block', marginBottom: '6px' }}>Password</label>
        <div style={{ position: 'relative' }}>
         <input
         name="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        onChange={handleInputChange}
        style={{ width: '100%', margin: '0', paddingRight: '44px' }}
        />
        <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer', width: 'auto', height: 'auto', padding: '0', margin: '0', fontSize: '18px' }}
        >
      {showPassword ? '🙈' : '👁️'}
        </button>
       </div>
      </div>
        <button type="submit" style={{ width: '100%', margin: '8px 0 0' }}>
          {status || "Sign in"}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6B6B6B' }}>
        Don't have an account?{' '}
        <Link to="/auth/sign-up" style={{ color: '#007A8A', background: 'transparent', border: 'none', width: 'auto', height: 'auto', padding: '0', margin: '0', display: 'inline', fontWeight: '500' }}>
          Sign up
        </Link>
      </p>

    </main>
  );
};

export default SignInPage;