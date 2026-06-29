import { useSession } from "../context/SessionContext"; 
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";

function EditProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name, bio, avatar_url')
        .eq('id', session.user.id)
        .single();
      if (data) {
        setName(data.name || '');
        setBio(data.bio || '');
        setAvatarPreview(data.avatar_url || null);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };


const handleSave = async () => {
    console.log('avatarFile value:', avatarFile);
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

    console.log('update being saved:', updates);
    console.log('user id:', session.user.id);
    const { error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", session.user.id);
    console.log('update error:', updateError);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <main style={{ margin: '0 auto', padding: '48px 24px', width: '100%', maxWidth: '480px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#0A0A0A', marginBottom: '8px' }}>Edit profile</h1>
        <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Update your information</p>
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
            Change photo
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </label>
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#0A0A0A', display: 'block', marginBottom: '6px' }}>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', margin: '0' }} />
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#0A0A0A', display: 'block', marginBottom: '6px' }}>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: '100%', minHeight: '120px', padding: '0.875rem', borderRadius: '10px', background: '#F7F9FA', border: '1px solid #E8ECEE', color: '#0A0A0A', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
        </div>

        <button onClick={handleSave} disabled={loading} style={{ width: '100%', margin: '0' }}>
          {loading ? "Saving..." : "Save changes"}
        </button>

        {error && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
      </div>
    </main>
  );
}

export default EditProfile;