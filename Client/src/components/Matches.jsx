import "./ProfileTest.css";
import InterestDisplay from "./InterestDisplay.jsx";
import SkillDisplay from "./SkillDisplay.jsx";
import * as api from "../util/api.js";
import { useState } from "react";
import ProfileView from "./ProfileView.jsx";
function ProfileCreate(user){
    const [matches, setMatches] = useState([]);
    console.log("Fetching matches for user:", user);
    api.matches.getMatches(user.username).then((res) => {
        setMatches(res);
    }).catch((err) => {
        console.error("Error fetching matches:", err);
    });
    return(
    <div className="container">
        <h1>Looking For Love Profile Match</h1>
        {matches.map((profile, i = 0) => <ProfileView key={i++} user={profile} setMatches={setMatches} />)}
    </div>
    )//LF: 10 privacy levels may be too many to program. Was thinking around 3-5 levels, but we can talk about it. This is a test form anyway of course.
    //LF: Editing password ask for the old password once then the new password twice.
}
export default ProfileCreate;