import "./ProfileTest.css";
import InterestDisplay from "./InterestDisplay.jsx";
import SkillDisplay from "./SkillDisplay.jsx";
import { useState, useEffect } from "react";
import * as api from "../util/api.js";

function ProfileEdit(props){
    const [user, setUser] = useState({id: 1, username: "JohnDoe", email: "johndoe@example.com", firstName: "John", lastName: "Doe", skills: [{id: 0, name: "JavaScript"}, {id: 1, name: "Python"}], interests: [{id: 0, name: "Hiking"}], location: {country: "Canada", region: "Ontario", city: "Toronto", streetAddress: "123 Main St"}, privacyLevel: 2, employment: {workplace: "Example Corp", position: "Example Position"}});//Hardcoded for testing purposes.
    const [tempUser, setTempUser] = useState(user);//Temp user state to hold changes until save is clicked.
    useEffect(() => {
            const loadUser = async () => {
                let result = await api.profile.getUser(props.id);
                setUser(result);
            }
            loadUser();
        }, [props.id]);
    function saveProfile(){//LF: Save user function which calls a post request to the server to save the profile to db. Needs error handling for invalid input.
        api.profile.saveUser(tempUser);
    }
    return(
    <div className="container">
        <h1>Looking For Love Profile Editor</h1>
        <h2>Edit Profile</h2>

        <form className="form">
        <label >Username</label>
        <input type="text" placeholder="Username" defaultValue={user.username} onChange={(e) => setTempUser({...tempUser, username: e.target.value})}/>

        <label >Email</label>
        <input type="text" placeholder="Email" defaultValue={user.email} onChange={(e) => setTempUser({...tempUser, email: e.target.value})}/>

        <label >Old Password</label>
        <input type="password" placeholder="Password"/>

        <label >New Password</label>
        <input type="password" placeholder="New Password"/>

        <label >Confirm New Password</label>
        <input type="password" placeholder="Confirm New Password"/>

        <label >FirstName</label>
        <input type="text" placeholder="First Name" defaultValue = {user.firstName} onChange={(e) => setTempUser({...tempUser, firstName: e.target.value})}/>
        {/*LF: First and last name likely will not be modifiable without contacting the theoretical app support team. Hardcoded for now*/}
        <label >LastName</label>
        <input type="text" placeholder="Last Name" defaultValue = {user.lastName} onChange={(e) => setTempUser({...tempUser, lastName: e.target.value})}/>

        <label >Skills</label>
        {tempUser.skills.map(skill => <SkillDisplay key={skill.id} skill={skill} /*setSkills={setTempSkills}TODO:Implement way to pass a function to change skills*//>)}
        <input type="text" placeholder="Add skill"/>
        <button type="button" onClick={() => {//LF: Add skill function which adds the skill in the input field to the skills array in state and then clear the input and update the display, All skills will be added to user on save profile.
            const skill = {id: tempUser.skills.length/*LF: Returns 0 if array is empty, otherwise returns index of element to be inserted */, name: document.querySelector('input[placeholder="Add skill"]').value};
            if(skill.name === "") return;//LF: Don't add empty skills.
            setTempUser({...tempUser, skills: [...tempUser.skills, skill]})
            document.querySelector('input[placeholder="Add skill"]').value = "";
        }}>Add Skill</button>

        <label >Interests</label>
        {tempUser.interests.map(interest => <InterestDisplay key={interest.id} interest={interest} /*setInterests={setTempInterests}TODO:Implement way to pass a function to change interests*//>)}
        <input type="text" placeholder="Add interest"/>
        <button type="button" onClick={() => {//LF: Add interest function which adds the interest in the input field to the interests array in state and then clear the input and update the display, All interests will be added to user on save profile.
            const interest = {id: tempUser.interests.length/*LF: Returns 0 if array is empty, otherwise returns index of element to be inserted */, name: document.querySelector('input[placeholder="Add interest"]').value};
            if(interest.name === "") return;//LF: Don't add empty interests.
            setTempUser({...tempUser, interests: [...tempUser.interests, interest]})
            document.querySelector('input[placeholder="Add interest"]').value = "";
        }}>Add Interest</button>
        
        {/*LF: Location inputs below. Was thinking of having privacyLevel affect which of these is shown on profile view for other users. For example, if privacyLevel is 0, everything is shown. If it's 1, everything but address is shown, etc.*/}
        {/*LF: Was thinking of making everything but country optional*/}
        <label >Country</label>
        <input type="text" placeholder="Country" defaultValue={user.location.country} onChange={(e) => setTempUser({...tempUser, location: {...tempUser.location, country: e.target.value}})}/>
        <label >Region</label>
        <input type="text" placeholder="Province/State/Region" defaultValue={user.location.region || ''} onChange={(e) => setTempUser({...tempUser, location: {...tempUser.location, region: e.target.value}})}/>
        <label >City</label>
        <input type="text" placeholder="City/Town" defaultValue={user.location.city || ''} onChange={(e) => setTempUser({...tempUser, location: {...tempUser.location, city: e.target.value}})}/>
        <label >Address</label>
        <input type="text" placeholder="Street Address" defaultValue={user.location.streetAddress || ''} onChange={(e) => setTempUser({...tempUser, location: {...tempUser.location, streetAddress: e.target.value}})}/>

        {/*LF: Workplace and position inputs below. These will likely also be optional and have privacy levels assigned to them in some way.*/}
        <label >Workplace</label>
        <input type="text" placeholder="Company" defaultValue={user.employment.workplace || ''} onChange={(e) => setTempUser({...tempUser, employment: {...tempUser.employment, workplace: e.target.value}})}/>

        <label >Position</label>
        <input type="text" placeholder="Job Title / Position" defaultValue={user.employment.position || ''} onChange={(e) => setTempUser({...tempUser, employment: {...tempUser.employment, position: e.target.value}})}/>

        <label >PrivacyLevel</label>
        <input type="number" placeholder="0-10" defaultValue={user.privacyLevel} onChange={(e) => setTempUser({...tempUser, privacyLevel: e.target.value})}/>

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