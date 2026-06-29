        Home page after line 19
        
        <Link
          //to="https://github.com/mmvergara/react-supabase-auth-template"
         // target="_blank"
          //rel="noreferrer noopener"
          //id="github-repo-link"
        >
          <svg
          //  xmlns="http://www.w3.org/2000/svg"
          //  x="0px"
          //  y="0px"
           // width="30"
           // height="50"
          //  viewBox="0 0 64 64"
          >
            <path
              //fill="#fff"
             // d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z"
            ></path>
          </svg>
          Star us on Github 🌟
        </Link>



        import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useSession } from "../context/SessionContext";

const HomePage = () => {
  const { session } = useSession();
  return (
    <main>
      <section className="main-container">
        <img src="/fitinlogo.jpg" alt="FitTrack Logo" style={{ width: '100px', marginBottom: '20px' }} />
        <h1 className="header-text">Start the Journey</h1>
        <p>Current User : {session?.user.email || "None"}</p>
        {session ? (
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        ) : (
          <Link to="/auth/sign-in">Sign In</Link>
        )}
        <Link to="/protected">Protected Page 🛡️</Link>
        <div id="divider"></div>

      </section>
    </main>
  );
};

export default HomePage;



app.jsx

import { useState } from 'react'
import Auth from './components/Auth'
import PrePlayCard from './components/PrePlayCard'
import './App.css'

function App() {
  return (
    <div>
      <Auth />
    </div>
  )
}

   // <div>
     // <PrePlayCard 
      //title = "Be in shape, and get healthy at your own pace."
     // buttonText = "Look for a coach"
     // buttonLink = "../lets-train"
      // />
    //</div>
  //);
//}

change in DashboardRouters  (thi was the original.)

import { useSession } from '../context/SessionContext';
import RoleSelector from './RoleSelector';
import CoachDashboard from '../Pages/CoachDashboard';
import AthleteDashboard from '../Pages/AthleteDashboard';

  export default function DashboardRouter() {
  return <div style={{ fontSize: '2rem', padding: '2rem', textAlign: 'center' }}>✅ Dashboard route works!</div>;


  if (loading) return <div className="main-container">Loading...</div>;
  if (!session) return <div className="main-container">Please log in.</div>;

  const role = session.user?.user_metadata?.role;

  if (!role) return <RoleSelector />;

  if (role === 'coach') return <CoachDashboard />;
  if (role === 'athlete') return <AthleteDashboard />;

  return <div className="main-container">Unknown role. Contact support.</div>;
}




export default App

Role Selctor changed:   

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function RoleSelector() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveRole = async (role) => {
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { role: role }
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // For now, just show an alert that role is saved
    alert(`Role saved as ${role}! (Redirect will come later)`);
    setLoading(false);
  };

  return (
    <div className="main-container" style={{ textAlign: 'center' }}>
      <h1 className="header-text">Choose Your Role</h1>
      <p>Are you a Coach or an Athlete?</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => saveRole('coach')} disabled={loading}>
           I am a Coach
        </button>
        <button onClick={() => saveRole('athlete')} disabled={loading}>
           I am an Athlete
        </button>
      </div>
      {loading && <p>Saving...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

changing singUp, we are going to insert the rpofile row directly better than a trigger.

import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { supabase } from "../../utils/supabaseClient";

const SignUpPage = () => {
  // ==============================
  // If user is already logged in, redirect to home
  // This logic is being repeated in SignIn and SignUp..
  // maybe we can create a wrapper component for these pages
  // just like the ./router/AuthProtectedRoute.tsx? up to you.
  // ==============================
  const { session } = useSession();
  const [status, setStatus] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  if (session) return <Navigate to="/dashboard" />;

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Creating account...");
    const { error } = await supabase.auth.signUp({
      email: formValues.email,
      password: formValues.password,
    });
    if (error) {
      alert(error.message)
      return;
    } else {
      navigate('/dashboard'); // added
    }
    setStatus("");
  };

  return (
    <main>
      <Link className="home-link" to="/">
        ◄ Home
      </Link>
      <form className="main-container" onSubmit={handleSubmit}>
        <h1 className="header-text">Sign Up</h1>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#777",
          }}
        >
          Demo app, please don't use your real email or password
        </p>
        <input
          name="email"
          onChange={handleInputChange}
          type="email"
          placeholder="Email"
        />
        <input
          name="password"
          onChange={handleInputChange}
          type="password"
          placeholder="Password"
        />
        <button type="submit">Create Account</button>
        <Link className="auth-link" to="/auth/sign-in">
          Already have an account? Sign In
        </Link>
        {status && <p>{status}</p>}
      </form>
    </main>
  );
};

export default SignUpPage;  

chage CoachOnbording: 

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { supabase } from "../utils/supabaseClient";

function CoachOnboarding() {
    const { session } = useSession();
    const navigate = useNavigate();
    const [ name, setName ] = useState("");
    const [ bio, setBio ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ avatarFile, setAvatarFile ] = useState(null);
    const [ avatarPreview, setAvatarPreview ] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        let avatar_url = null;

        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = '${session.user.id}.${fileExt}';
            const { error: uploadError } = await supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

            avatar_url = urlData.publicUrl;
        }

        const { error: updateError } = await supabase
        .from("profiles")
        .update({ name: name, bio: bio })
        .eq("id" , session.user.id);
        
        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }
        navigate("/coach-dashboard");
    };

    return (
        <main>
            <section className="main-container">
            <h1 className="header-text"> Set up your Coach Profilr</h1>
            <p>Tell athletes more about yourself</p>

            <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}/>

            <textarea placeholder="describe your experience as a coach"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style= {{ width: "300px", height: "120px", padding: "1rem", marginTop: "7px", borderRadius: "4px", background: "#3a3a3a", color: "white", border: "1px solid #4a4a4a"}}/>

            <button onClick={handleSave} disabled={loading}>
                {loading ? "saving..." : "Save and Continue"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </section>
        </main>
    );
}
  change of my athleteOnboarding jsx function 

      const handleSave = async () => {
        setLoading(true);
        setError(null);

        const { error: updateError } = await supabase
        .from("profiles")
        .update({ name: name, bio: bio })
        .eq("id" , session.user.id);

    const handleAvatarChange = (e) => {
        const file = e-target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
        
        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }
        navigate("/athlete-dashboard");
    };


export default CoachOnboarding;   

this is my last CSS

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif !important;
}
body {
  background-color: #1c1c1c; /* Darker background, closer to Supabase style */
  color: white;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10vh;
  padding-bottom: 80px;
}
a {
  text-decoration: none;
}
.header-text {
  display: flex;
  gap: 0.5em;
  align-items: center;
  padding: 0.5em 1em;
  font-weight: bold;
  background: none;
  text-align: center;
}
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2a2a2a; /* Slightly lighter than body, but still dark */
  padding: 2em 2em;
  width: 100%;
  max-width: 500px;
  border-radius: 8px; /* Slightly rounded corners */
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.2);
  border-top: 5px;
  border-width: 10px 0px 0px 0px;
  border-style: solid;
  border-color:  #4fdce1; /* Supabase green */
}
#github-repo-link {
  display: flex;
  gap: 0.5em;
  margin-top: 0;
  align-items: center;
  padding: 0.5em 1em;
  font-weight: bold;
  background: none;
  cursor: pointer;
  color:  #4fdce1; /* Supabase green */
}
#github-repo-link:hover {
  background-color: rgba(
    62,
    207,
    142,
    0.1
  ); /* Supabase green with low opacity */
}
input {
  padding: 1rem;
  border-radius: 4px;
  outline: none;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  background-color: #3a3a3a; /* Slightly lighter than container background */
  border: 1px solid #4a4a4a;
  font-size: 1rem;
  color: white;
  margin-top: 7px;
  width: 300px;
}
button,
a {
  font-size: 16px;
  padding: 1em;
  background: none;
  cursor: pointer;
  color: white;
  background:  #4fdce1; /* Supabase green */
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
  width: 300px;
  text-align: center;
  margin-top: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  font-weight: bold;
  border: 1px solid  #4fdce1; /* Supabase green */
}

a {
  border: none;
}
button:hover,
a:hover {
  background:  #4fdce1; /* Slightly darker Supabase green for hover */
}
.home-link {
  margin-bottom: 1em;
}
.auth-link {
  background: transparent;
  color: #4fdce1; /* Supabase green */
}
.auth-link:hover {
  background: transparent;
  text-decoration: underline;
}
#divider {
  width: 70%;
  height: 2px;
  background-color:  #4fdce1; /* Supabase green */
  margin: 1em 0;
  border-radius: 100%;
}