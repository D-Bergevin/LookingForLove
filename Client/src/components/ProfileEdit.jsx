import "./ProfileTest.css";
import InterestDisplay from "./InterestDisplay.jsx";
import SkillDisplay from "./SkillDisplay.jsx";
import { useState } from "react";
import * as api from "../util/api.js";

function ProfileEdit(props){
    const [tempUser, setTempUser] = useState(props.user);//Temp user state to hold changes until save is clicked.
    function saveProfile(){//LF: Save user function which calls a post request to the server to save the profile to db. Needs error handling for invalid input.
        api.profile.saveUser(tempUser);
    }
    return(
    <div className="container">
        {console.log(tempUser)}
        <h1>Looking For Love Profile Editor</h1>
        <h2>Edit Profile</h2>
        <form className="form">
        <label >Username</label>
        <input type="text" placeholder="Username" defaultValue={props.user.username} onChange={(e) => setTempUser({...tempUser, username: e.target.value})}/>

        <label >Email</label>
        <input type="text" placeholder="Email" defaultValue={props.user.email} onChange={(e) => setTempUser({...tempUser, email: e.target.value})}/>

        <label >Old Password</label>
        <input type="password" placeholder="Password"/>

        <label >New Password</label>
        <input type="password" placeholder="New Password"/>

        <label >Confirm New Password</label>
        <input type="password" placeholder="Confirm New Password"/>

        <label >FirstName</label>
        <input type="text" placeholder="First Name" defaultValue = {props.user.firstName} onChange={(e) => setTempUser({...tempUser, firstName: e.target.value})}/>
        {/*LF: First and last name likely will not be modifiable without contacting the theoretical app support team. Hardcoded for now*/}
        <label >LastName</label>
        <input type="text" placeholder="Last Name" defaultValue = {props.user.lastName} onChange={(e) => setTempUser({...tempUser, lastName: e.target.value})}/>

        <label >Skills</label>
        {tempUser.skills.map((interest, i = 0) => <InterestDisplay key={i++} interest={interest} /*TODO:setSkills={setTempUser}*//>)}
        <input type="text" placeholder="Add skill"/>
        <button type="button" onClick={() => {//LF: Add skill function which adds the skill in the input field to the skills array in state and then clear the input and update the display, All skills will be added to user on save profile.
            const skill = document.querySelector('input[placeholder="Add skill"]').value;
            if(skill.name === "") return;//LF: Don't add empty skills.
            setTempUser({...tempUser, skills: [...tempUser.skills, skill]})
            document.querySelector('input[placeholder="Add skill"]').value = "";
        }}>Add Skill</button>

        <label >Interests</label>
        {tempUser.interests.map((interest, i = 0) => <InterestDisplay key={i++} interest={interest} /*TODO:setInterests={setTempUser}*//>)}
        <input type="text" placeholder="Add interest"/>
        <button type="button" onClick={() => {//LF: Add interest function which adds the interest in the input field to the interests array in state and then clear the input and update the display, All interests will be added to user on save profile.
            const interest = document.querySelector('input[placeholder="Add interest"]').value;
            if(interest.name === "") return;//LF: Don't add empty interests.
            setTempUser({...tempUser, interests: [...tempUser.interests, interest]})
            document.querySelector('input[placeholder="Add interest"]').value = "";
        }}>Add Interest</button>
        
        {/*LF: Location inputs below. Was thinking of having privacyLevel affect which of these is shown on profile view for other users. For example, if privacyLevel is 0, everything is shown. If it's 1, everything but address is shown, etc.*/}
        {/*LF: Was thinking of making everything but country optional*/}
        <label >Country</label>
        <input type="text" placeholder="Country" defaultValue={props.user.location.country} onChange={(e) => setTempUser({...tempUser, location: {...tempUser.location, country: e.target.value}})}/>
        <label >Region</label>
        <input type="text" placeholder="Province/State/Region" defaultValue={props.user.location.region} onChange={(e) => setTempUser({...tempUser, location: {...tempUser.location, region: e.target.value}})}/>
        <label >City</label>
        <input type="text" placeholder="City/Town" defaultValue={props.user.location.city} onChange={(e) => setTempUser({...tempUser, location: {...tempUser.location, city: e.target.value}})}/>
        <label >Address</label>
        <input type="text" placeholder="Street Address" defaultValue={props.user.location.streetAddress} onChange={(e) => setTempUser({...tempUser, location: {...tempUser.location, streetAddress: e.target.value}})}/>

        {/*LF: Workplace and position inputs below. These will likely also be optional and have privacy levels assigned to them in some way.*/}
        <label >Workplace</label>
        <input type="text" placeholder="Company" defaultValue={props.user.employment.workplace} onChange={(e) => setTempUser({...tempUser, employment: {...tempUser.employment, workplace: e.target.value}})}/>

        <label >Position</label>
        <input type="text" placeholder="Job Title / Position" defaultValue={props.user.employment.position} onChange={(e) => setTempUser({...tempUser, employment: {...tempUser.employment, position: e.target.value}})}/>

        <label >PrivacyLevel</label>
        <input type="number" placeholder="0-10" defaultValue={props.user.privacyLevel} onChange={(e) => setTempUser({...tempUser, privacyLevel: e.target.value})}/>

        <button type="button" onClick={() => {
            saveProfile();
        }}>Save Profile</button>
        <button type="button">Cancel</button>

        </form>
        </div>
        )//LF: 10 privacy levels may be too many to program. Was thinking around 3-5 levels, but we can talk about it. This is a test form anyway of course.
        //LF: Editing password ask for the old password once then the new password twice.
}
export default ProfileEdit;