import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Matches from "./components/Matches.jsx";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileEdit from "./components/ProfileEdit";
import { profile } from "./util/api.js";

// dev components
import ProfileView from "./components/ProfileView.jsx";
import InterestDisplay from "./components/InterestDisplay.jsx";
import SkillDisplay from "./components/SkillDisplay.jsx";
import PotentialMatches from "./components/PotentialMatches.jsx";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // test data for dev buttons
  const [testInterests, setTestInterests] = useState([
    "Gaming",
    "Music",
    "Travel",
  ]);
  const [testSkills, setTestSkills] = useState([
    "React",
    "JavaScript",
    "CSS",
  ]);

  const navButtonStyle = {
    padding: "5px",
  };

  const normalizeUser = (u) => ({
    username: u?.username || "",
    email: u?.email || "",
    password: u?.password || "",
    firstName: u?.firstName || "",
    lastName: u?.lastName || "",
    skills: Array.isArray(u?.skills) ? u.skills : [],
    interests: Array.isArray(u?.interests) ? u.interests : [],
    location: {
      country: u?.location?.country || "",
      region: u?.location?.region || "",
      city: u?.location?.city || "",
      address: u?.location?.address || "",
    },
    employment: {
      workplace: u?.employment?.workplace || "",
      position: u?.employment?.position || "",
    },
    privacyLevel: u?.privacyLevel ?? 0,
    displayedGender: u?.displayedGender || "",
    datingPreference: u?.datingPreference || "",
  });

  const authToken = localStorage.getItem("authToken");
  const isAuthenticated = !!authToken;

  const fetchUserProfile = async (username, redirectToProfile = true) => {
    try {
      setLoadingUser(true);

      const userData = await profile.getUser(username);
      const normalizedUser = normalizeUser(userData);

      setUser(normalizedUser);
      localStorage.setItem("username", normalizedUser.username);

      if (redirectToProfile) {
        setPage("profile");
      }
    } catch (e) {
      console.error("Failed to load user profile:", e);
      toast.error(e.message || "Failed to load user profile");

      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      setUser(null);
      setPage("login");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      const token = localStorage.getItem("authToken");
      const savedUsername = localStorage.getItem("username");

      if (!token) {
        setLoadingUser(false);
        setPage("login");
        return;
      }

      if (savedUsername) {
        await fetchUserProfile(savedUsername, true);
      } else {
        setLoadingUser(false);
        setPage("login");
      }
    };

    initializeSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setUser(null);
    setPage("login");
    toast.success("Logged out successfully");
  };

  if (loadingUser) {
    return (
      <>
        <Toaster position="top-right" />
        <div style={{ padding: "20px" }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      {/* NAVIGATION */}
      <div
        style={{
          padding: "10px 16px",
          background: "#eee",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {!isAuthenticated ? (
          <>
            <button
              onClick={() => setPage("login")}
              style={navButtonStyle}
            >
              Login
            </button>

            <button
              onClick={() => setPage("signup")}
              style={navButtonStyle}
            >
              Signup
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setPage("profile")}
              style={navButtonStyle}
            >
              My Profile
            </button>

            {/* keep these only if needed for dev testing */}
            <button
              onClick={() => setPage("profileView")}
              style={navButtonStyle}
            >
              Test ProfileView
            </button>

            <button
              onClick={() => setPage("testInterest")}
              style={navButtonStyle}
            >
              Test Interests
            </button>

            <button
              onClick={() => setPage("testPotentialMatches")}
              style={navButtonStyle}
            >
              Test Potential Matches
            </button>

            <button
              onClick={() => setPage("testMatches")}
              style={navButtonStyle}
            >
              Test Matches
            </button>

            <button
              onClick={() => setPage("testSkills")}
              style={navButtonStyle}
            >
              Test Skills
            </button>

            <button
              onClick={handleLogout}
              style={{ ...navButtonStyle, marginLeft: "auto" }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* PUBLIC PAGES */}
      {!isAuthenticated && page === "login" && (
        <Login
          setUser={async (u) => {
            if (u?.username) {
              localStorage.setItem("username", u.username);
              await fetchUserProfile(u.username, true);
            } else {
              toast.error("Username not found after login");
            }
          }}
          goToSignup={() => setPage("signup")}
        />
      )}

      {!isAuthenticated && page === "signup" && (
        <Signup goToLogin={() => setPage("login")} />
      )}

      {/* PROTECTED PAGES */}
      {isAuthenticated && page === "profile" && (
        <>
          <div
            className="d-flex align-items-center"
            style={{
              width: "100%",
              backgroundColor: "blue",
              color: "white",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <h1
              style={{
                margin: 0,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Looking For Love Profile Editor
            </h1>
          </div>

          {user ? (
            <ProfileEdit user={user} setUser={setUser} />
          ) : (
            <div className="spinner">Loading profile...</div>
          )}
        </>
      )}

      {isAuthenticated && page === "profileView" && (
        <ProfileView user={user} />
      )}

      {isAuthenticated && page === "testInterest" && (
        <div>
          {testInterests.map((interest) => (
            <InterestDisplay
              key={interest}
              interest={interest}
              setInterests={setTestInterests}
            />
          ))}
        </div>
      )}

      {isAuthenticated && page === "testSkills" && (
        <div>
          {testSkills.map((skill) => (
            <SkillDisplay
              key={skill}
              skill={skill}
              setSkills={setTestSkills}
            />
          ))}
        </div>
      )}

      {isAuthenticated && page === "testMatches" && (
        <div>
          {<Matches user={user} />}
        </div>
      )}
      {isAuthenticated && page === "testPotentialMatches" && (
        <div>
          {<PotentialMatches user={user} />}
        </div>
      )}
    </>
  );
}

export default App;