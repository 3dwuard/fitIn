import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { supabase } from "../utils/supabaseClient";

function AthleteOnboarding() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    let avatar_url = null;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${session.user.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });
      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      avatar_url = urlData.publicUrl;
    }
    const updates = { name, bio };
    if (avatar_url) {
    updates.avatar_url = avatar_url;
    }

    const { error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", session.user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    navigate("/athlete-dashboard");
  };

  return (
    <main style={{ margin: '0 auto', padding: '48px 24px', width: '100%', maxWidth: '480px' }}>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-block', background: '#E0FFFE', color: '#007A8A', fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', marginBottom: '16px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          Athlete profile
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#0A0A0A', marginBottom: '8px' }}>
          Set up your profile
        </h1>
        <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Tell coaches about your goals</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00E5FF' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#E0FFFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              📷
            </div>
          )}
          <label style={{ fontSize: '13px', color: '#007A8A', fontWeight: '500', cursor: 'pointer' }}>
            Upload photo
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </label>
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#0A0A0A', display: 'block', marginBottom: '6px' }}>Your name</label>
          <input
            type="text"
            placeholder="e.g. Maria García"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', margin: '0' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#0A0A0A', display: 'block', marginBottom: '6px' }}>Your goals</label>
          <textarea
            placeholder="What do you want to achieve? What kind of coach are you looking for?"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: '100%', minHeight: '120px', padding: '0.875rem', borderRadius: '10px', background: '#F7F9FA', border: '1px solid #E8ECEE', color: '#0A0A0A', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        <button onClick={handleSave} disabled={loading} style={{ width: '100%', margin: '0' }}>
          {loading ? "Saving..." : "Continue →"}
        </button>

        {error && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
      </div>
    </main>
  );
}

export default AthleteOnboarding;