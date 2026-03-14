import "./ProfileTest.css";
import InterestDisplay from "./InterestDisplay.jsx";
import SkillDisplay from "./SkillDisplay.jsx";
import * as api from "../util/api.js";
import { useState } from "react";
function ProfileCreate(){
    const [user, setUser] = useState({});
    const [skills, setSkills] = useState([]);
    const [interests, setInterests] = useState([]);
    function saveProfile(){//LF: Save user function which calls a post request to the server to save the profile to db. TODO: Needs error handling for invalid input as well as for password compare check.
        setUser({...user, interests: interests, skills: skills});//LF:  Bring interests and skills into user before saving to db.
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

        <label >Password</label>
        <input type="password" placeholder="Password" onChange={(e) => setUser({...user, tempPassword: e.target.value})}/>

        <label >Confirm Password</label>
        <input type="password" placeholder="Confirm Password"/>

        <label >FirstName</label>
        <input type="text" placeholder="First Name" onChange={(e) => setUser({...user, firstName: e.target.value})}/>
        <label >LastName</label>
        <input type="text" placeholder="Last Name" onChange={(e) => setUser({...user, lastName: e.target.value})}/>

        <label >Skills</label>
        {skills.map(skill => <SkillDisplay key={skill.id} skill={skill} setSkills={setSkills} />)}
        <input type="text" placeholder="Add skill"/>
        <button type="button" onClick={() => {//LF: Add interest function which adds the interest in the input field to the interests array in state and then clear the input and update the display, All interests will be added to user on save profile.
            const skill = {id: skills.length-1/*LF: Returns 0 if array is empty, otherwise returns index of element to be inserted */, name: document.querySelector('input[placeholder="Add skill"]').value};
            if(skill.name === "") return;//LF: Don't add empty skills.
            setSkills([...skills, skill]);
            document.querySelector('input[placeholder="Add skill"]').value = "";
        }}>Add Skill</button>

        <label >Interests</label>
        {interests.map(interest => <InterestDisplay key={interest.id} interest={interest} setInterests={setInterests} />)}
        <input type="text" placeholder="Add interest"/>
        <button type="button" onClick={() => {//LF: Add interest function which adds the interest in the input field to the interests array in state and then clear the input and update the display, All interests will be added to user on save profile.
            const interest = {id: interests.length-1/*LF: Returns 0 if array is empty, otherwise returns index of element to be inserted */, name: document.querySelector('input[placeholder="Add interest"]').value};
            if(interest.name === "") return;//LF: Don't add empty interests.
            setInterests([...interests, interest]);
            document.querySelector('input[placeholder="Add interest"]').value = "";
        }}>Add Interest</button>
        
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

        <button type="button" onClick={() => {
            saveProfile();
        }}>Create Profile</button>
        <button type="button">Cancel</button>

        </form>
        </div>
        )//LF: 10 privacy levels may be too many to program. Was thinking around 3-5 levels, but we can talk about it. This is a test form anyway of course.
        //LF: Editing password ask for the old password once then the new password twice.
}
export default ProfileCreate;