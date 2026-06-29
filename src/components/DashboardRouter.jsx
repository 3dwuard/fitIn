import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { supabase } from '../utils/supabaseClient';
import LoadingPage from '../Pages/LoadingPage';

export default function DashboardRouter() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!profile?.role) {
        navigate('/role-select');
      } else if (profile.role === 'coach' && (!profile.name || profile.name.trim() === '')) {
        navigate('/coach-onboarding');
      } else if (profile.role === 'coach') {
        navigate('/coach-dashboard');
      } else if (profile.role === 'athlete' && !profile.name) {
        navigate('/athlete-onboarding');
      } else{
        navigate('/athlete-dashboard');
      }
  
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) return <LoadingPage />;
  return null;
}