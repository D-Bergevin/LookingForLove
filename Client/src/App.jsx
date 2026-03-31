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

function App() {
  const [page, setPage] = useState("login"); // default page
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

const sanmpleUser = user ? {
  username: user.username ? user.username : "",
  email: user.email ? user.email : "",
  password: user.password ? user.password : "",

  firstname: user.firstname ? user.firstname : "Testing",
  lastname: user.lastname ? user.lastname : "Profile",

  skills: user.skills && user.skills.length ? user.skills : ["Testing", "Skill 1"],
  interests: user.interests && user.interests.length ? user.interests : ["Test", "IT"],

  location: {
    Country: user.location?.Country ? user.location.Country : "Canada",
    Region: user.location?.Region ? user.location.Region : "Ontario",
    Address: user.location?.Address ? user.location.Address : "123 Street Rd."
  },

  employment: {
    workplace: user.employment?.workplace ? user.employment.workplace : "Job Ltd.",
    position: user.employment?.position ? user.employment.position : "IT"
  },

  privacyLevel: user.privacyLevel !== undefined ? user.privacyLevel : 0,

  displayedGender: user.displayedGender ? user.displayedGender : "",
  datingPreference: user.datingPreference ? user.datingPreference : ""

} : null;

  // Fetch full profile after login
  const fetchUserProfile = async (username) => {
    try {
      setLoadingUser(true);
      const userData = await profile.getUser(username);
      setUser(userData);
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
            style={{ position: "relative", width: "100%", backgroundColor: "blue", color:"white", padding: "15px"}}
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
                top:"0px"
              }}
            >
              Logout
            </button>
          </div>
          {loadingUser ? (
            <div className="spinner">Loading profile...</div>
          ) : (
            user && <ProfileEdit user={sanmpleUser} />
          )}
        </>
      )}
    </>
  );
}

export default App;