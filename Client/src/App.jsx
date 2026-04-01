// import './App.css'
// import ProfileCreate from './components/ProfileCreate.jsx'
// import ProfileEdit from "./components/ProfileEdit.jsx"
// import ProfileView from './components/ProfileView.jsx'
// function App() {
//   return <ProfileEdit user={{username:"TProf",email:"tprofile@email.com",password:"ThisIsAPassword",firstname:"Testing",lastname:"Profile",skills:["Testing","Skill 1"],interests:["Test","IT"],location:{Country:"Canada",Region:"Ontario",Address:"123 Street Rd."},employment:{workplace:"Job Ltd.",position:"IT"},privacyLevel:0}}/>

// }

// export default App;

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileEdit from "./components/ProfileEdit";
import { profile } from "./util/api.js";

//adding for dev buttons
import ProfileView from "./components/ProfileView.jsx"
import InterestDisplay from "./components/InterestDisplay.jsx";
import SkillDisplay from "./components/SkillDisplay.jsx";


function App() {
  const [page, setPage] = useState("login"); // default page
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  //Test Interests and skills for dev buttons
  const [testInterests, setTestInterests] = useState(["Gaming", "Music", "Travel"]);
  const [testSkills, setTestSkills] = useState(["React", "JavaScript", "CSS"]);

  //herlper incase user info is null
  const normalizeUser = (u) => ({
    username: u?.username || "",
    email: u?.email || "",
    password: u?.password || "",
    firstName: u?.firstName || "",
    lastName: u?.lastName || "",
    skills: Array.isArray(u?.skills) ? u.skills : [],
    interests: Array.isArray(u?.interests) ? u.interests : [],
    location: {
      Country: u?.location?.Country || "",
      Region: u?.location?.Region || "",
      Address: u?.location?.Address || "",
    },
    employment: {
      workplace: u?.employment?.workplace || "",
      position: u?.employment?.position || "",
    },
    privacyLevel: u?.privacyLevel ?? 0,
    displayedGender: u?.displayedGender || "",
    datingPreference: u?.datingPreference || "",
  });

  // Fetch full profile after login
  const fetchUserProfile = async (username) => {
    try {
      setLoadingUser(true);
      const userData = await profile.getUser(username);
      //console logs for debuging purposes
      console.log("Raw data", userData);
      console.log("Normalized data", normalizeUser(userData));
      setUser(normalizeUser(userData)); //normalizing data to handle null values
    } catch (e) {
      toast.error(e.message || "Failed to load user profile");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLogout = () => {
    // Clear user data & redirect to login page
    window.location.reload(); // simple reload for demo
  };

  return (
    <>

      <Toaster position="top-right" />

      {/* DEV TEST BUTTONS */}
      <div style={{ padding: "10px", background: "#eee" }}>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("signup")}>Signup</button>
        <button onClick={() => setPage("profile")}>My Profile</button>

        <button onClick={() => setPage("testView")}>Test ProfileView</button>
        <button onClick={() => setPage("testInterest")}>Test Interests</button>
        <button onClick={() => setPage("testSkills")}>Test Skills</button>
      </div>

      {page === "login" && (
        <Login
          setUser={async (u) => {
            // After login, fetch full user profile from backend
            await fetchUserProfile(u.username);
            setPage("profile");
          }}
          goToSignup={() => setPage("signup")}
        />
      )}

      {page === "signup" && (
        <Signup goToLogin={() => setPage("login")} />
      )}

      {page === "profile" && (
        <>
          <div
            className="d-flex align-items-center"
            style={{ position: "relative", width: "100%", backgroundColor: "blue", color: "white", padding: "15px" }}
          >
            {/* Center Title */}
            <h1
              style={{
                margin: "0 auto",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              Looking For Love Profile Editor
            </h1>

            {/* Right Button */}
            <button
              onClick={handleLogout}
              className="btn btn-light"
              style={{
                position: "absolute",
                right: "50px",
                top: "0px"
              }}
            >
              Logout
            </button>
          </div>
          {loadingUser ? (
            <div className="spinner">Loading profile...</div>
          ) : (
            user && <ProfileEdit user={user} />
          )}
        </>
      )}
      {/* New Pages for dev button debuging */}
      {page === "testView" && (
        <ProfileView user={user} />
      )}

      {page === "testInterest" && (
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

      {page === "testSkills" && (
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

    </>
  );
}

export default App;