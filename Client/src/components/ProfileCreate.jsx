import "./ProfileTest.css";
import InterestDisplay from "./InterestDisplay.jsx";
import SkillDisplay from "./SkillDisplay.jsx";
import * as api from "../util/api.js";
import { useState } from "react";
function ProfileCreate(){
    const [user, setUser] = useState({});
    function saveProfile(){//LF: Save user function which calls a post request to the server to save the profile to db. Needs error handling for invalid input.
        api.profile.saveUser(user);
    }
    return(
    <div className="container">
        <h1>Looking For Love Profile Creator</h1>
        <h2>Create Profile</h2>

        <form className="form">

        <label >Username</label>
        <input type="text" placeholder="Username" onChange={(e) => setUser({...user, username: e.target.value})}/>

        <label >Email</label>
        <input type="text" placeholder="Email" onChange={(e) => setUser({...user, email: e.target.value})}/>

        <label >Old Password</label>
        <input type="password" placeholder="Password" onChange={(e) => setUser({...user, tempPassword: e.target.value})}/>

        <label >Confirm New Password</label>
        <input type="password" placeholder="Confirm Password"/>

        <label >FirstName</label>
        <input type="text" placeholder="First Name" onChange={(e) => setUser({...user, firstName: e.target.value})}/>
        <label >LastName</label>
        <input type="text" placeholder="Last Name" onChange={(e) => setUser({...user, lastName: e.target.value})}/>

        <label >Skills</label>
        {user.skills.map(skill => <SkillDisplay key={skill.id} skill={skill}/>)/*LF: Placeholder for skills display*/}
        <input type="text" placeholder="Add skill placeholder"/>

        <label >Interests</label>
        {user.interests.map(interest => <InterestDisplay key={interest.id} interest={interest}/>)/*LF: Placeholder for interests display*/}
        <input type="text" placeholder="Add interest placeholder"/>
        {/*LF: Above is Placeholder for adding interests. This will probably call something to refresh the interests display for each one added to the map.*/}
        
        {/*LF: Location inputs below. Was thinking of having privacyLevel affect which of these is shown on profile view for other users. For example, if privacyLevel is 0, everything is shown. If it's 1, everything but address is shown, 2 would be everything but address and city, etc.*/}
        {/*LF: Was thinking of making everything but country optional*/}
        <label >Country</label>
        <input type="text" placeholder="Country" onChange={(e) => setUser({...user, country: e.target.value})}/>
        <label >Region</label>
        <input type="text" placeholder="Province/State/Region" onChange={(e) => setUser({...user, region: e.target.value})}/>
        <label >City</label>
        <input type="text" placeholder="City/Town" onChange={(e) => setUser({...user, city: e.target.value})}/>
        <label >Address</label>
        <input type="text" placeholder="Street Address" onChange={(e) => setUser({...user, address: e.target.value})}/>
        
        {/*LF: Workplace and position inputs below. These will likely also be optional and have privacy levels assigned to them in some way. Maybe a two digit number where the first digit is location privacy whilst second is workplace privacy?*/}
        <label >Workplace</label>
        <input type="text" placeholder="Company" onChange={(e) => setUser({...user, workplace: e.target.value})}/>

        <label >Position</label>
        <input type="text" placeholder="Job Title / Position" onChange={(e) => setUser({...user, position: e.target.value})}/>

        <label >PrivacyLevel</label>
        <input type="number" placeholder="0-10" onChange={(e) => setUser({...user, privacyLevel: e.target.value})}/>

        <button type="submit" onClick={() => {
            saveProfile();
        }}>Create Profile</button>
        <button type="cancel">Cancel</button>

        </form>

        </div>
        )//LF: 10 privacy levels may be too many to program. Was thinking around 3-5 levels, but we can talk about it. This is a test form anyway of course.
        //LF: Skills and interests will likely be a map or array of HTML components that the user can add to in a 'edit profile' page.
        //LF: Editing password ask for the old password once then the new password twice.
}
export default ProfileCreate;