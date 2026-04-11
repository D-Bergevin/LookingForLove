import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from "react-router";

import Matches from "./components/Matches.jsx";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileEdit from "./components/ProfileEdit";
import ProfileView from "./components/ProfileView.jsx";
import InterestDisplay from "./components/InterestDisplay.jsx";
import SkillDisplay from "./components/SkillDisplay.jsx";
import PotentialMatches from "./components/PotentialMatches.jsx";
import { profile } from "./util/api.js";

function ProtectedRoute({ isAuthenticated, loadingUser, children }) {
  const location = useLocation();

  if (loadingUser) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

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

  const navigate = useNavigate();

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
        navigate("/profile", { replace: true });
      }
    } catch (e) {
      console.error("Failed to load user profile:", e);
      toast.error(e.message || "Failed to load user profile");

      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      setUser(null);
      navigate("/login", { replace: true });
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
        return;
      }

      if (savedUsername) {
        await fetchUserProfile(savedUsername, false);
      } else {
        setLoadingUser(false);
      }
    };

    initializeSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Toaster position="top-right" />

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
            <Link to="/login">
              <button type="button" style={navButtonStyle}>
                Login
              </button>
            </Link>

            <Link to="/signup">
              <button type="button" style={navButtonStyle}>
                Signup
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile">
              <button type="button" style={navButtonStyle}>
                My Profile
              </button>
            </Link>

            <Link to="/profile-view">
              <button type="button" style={navButtonStyle}>
                Test ProfileView
              </button>
            </Link>

            {/* <Link to="/interests">
              <button type="button" style={navButtonStyle}>
                Test Interests
              </button>
            </Link> */}

            <Link to="/potential-matches">
              <button type="button" style={navButtonStyle}>
                Test Potential Matches
              </button>
            </Link>

            <Link to="/matches">
              <button type="button" style={navButtonStyle}>
                Test Matches
              </button>
            </Link>

            {/* <Link to="/skills">
              <button type="button" style={navButtonStyle}>
                Test Skills
              </button>
            </Link> */}

            <button
              type="button"
              onClick={handleLogout}
              style={{ ...navButtonStyle, marginLeft: "auto" }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      <Routes>
        {/* default route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* public */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" replace />
            ) : (
              <Login
                setUser={async (u) => {
                  if (u?.username) {
                    localStorage.setItem("username", u.username);
                    await fetchUserProfile(u.username, true);
                  } else {
                    toast.error("Username not found after login");
                  }
                }}
                goToSignup={() => navigate("/signup")}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" replace />
            ) : (
              <Signup goToLogin={() => navigate("/login")} />
            )
          }
        />

        {/* protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loadingUser={loadingUser}
            >
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
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-view"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loadingUser={loadingUser}
            >
              <ProfileView user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interests"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loadingUser={loadingUser}
            >
              <div>
                {testInterests.map((interest) => (
                  <InterestDisplay
                    key={interest}
                    interest={interest}
                    setInterests={setTestInterests}
                  />
                ))}
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loadingUser={loadingUser}
            >
              <div>
                {testSkills.map((skill) => (
                  <SkillDisplay
                    key={skill}
                    skill={skill}
                    setSkills={setTestSkills}
                  />
                ))}
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loadingUser={loadingUser}
            >
              <Matches user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/potential-matches"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loadingUser={loadingUser}
            >
              <PotentialMatches user={user} />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;