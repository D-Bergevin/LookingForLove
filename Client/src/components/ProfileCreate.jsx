import "./ProfileTest.css";
import InterestDisplay from "./InterestDisplay.jsx";
import SkillDisplay from "./SkillDisplay.jsx";
import { useState } from "react";
function ProfileCreate(){
    const [user] = useState({});//Hardcoded for testing purposes only.
    return(
    <div className="container">
        <h1>Looking For Love Profile Creator</h1>
        <h2>Create Profile</h2>

        <form className="form">

        <label >Username</label>
        <input type="text" placeholder="Username"/>

        <label >Email</label>
        <input type="text" placeholder="Email"/>

        <label >Old Password</label>
        <input type="password" placeholder="Password"/>

        <label >Confirm New Password</label>
        <input type="password" placeholder="Confirm Password"/>

        <label >FirstName</label>
        <input type="text" placeholder="First Name"/>

        <label >LastName</label>
        <input type="text" placeholder="Last Name"/>

        <label >Skills</label>
        {user.skills.map(skill => <SkillDisplay key={skill.id} skill={skill}/>)/*LF: Placeholder for skills display*/}
        <input type="text" placeholder="Add skill placeholder"/>

        <label >Interests</label>
        {user.interests.map(interest => <InterestDisplay key={interest.id} interest={interest}/>)/*LF: Placeholder for interests display*/}
        <input type="text" placeholder="Add interest placeholder"/>
        {/*LF: Above is Placeholder for adding interests. This will likely call something to refresh the interests display for each one added.*/}
        
        {/*LF: Location inputs below. Was thinking of having privacyLevel affect which of these is shown on profile view for other users. For example, if privacyLevel is 0, everything is shown. If it's 1, everything but address is shown, etc.*/}
        {/*LF: Was thinking of making everything but country optional*/}
        <label >Country</label>
        <input type="text" placeholder="Country"/>
        <label >Region</label>
        <input type="text" placeholder="Province/State/Region"/>
        <label >City</label>
        <input type="text" placeholder="City/Town"/>
        <label >Address</label>
        <input type="text" placeholder="Street Address"/>
        
        {/*LF: Workplace and position inputs below. These will likely also be optional and have privacy levels assigned to them in some way.*/}
        <label >Workplace</label>
        <input type="text" placeholder="Company"/>

        <label >Position</label>
        <input type="text" placeholder="Job Title / Position"/>

        <label >PrivacyLevel</label>
        <input type="number" placeholder="0-10"/>

        <button type="submit">Create Profile</button>
        <button type="cancel">Cancel</button>

        </form>

        </div>
        )//LF: 10 privacy levels may be too many to program. Was thinking around 3-5 levels, but we can talk about it. This is a test form anyway of course.
        //LF: Skills and interests will likely be a map or array of HTML components that the user can add to in a 'edit profile' page.
        //LF: Editing password ask for the old password once then the new password twice.
}
export default ProfileCreate;