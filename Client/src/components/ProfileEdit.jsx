import "./ProfileTest.css";
import InterestDisplay from "./InterestDisplay.jsx";
import SkillDisplay from "./SkillDisplay.jsx";
import { useState, useEffect } from "react";
import * as api from "../util/api.js";

function ProfileEdit(props){
    const [user, setUser] = useState({id: 1, username: "JohnDoe", email: "johndoe@example.com", firstName: "John", lastName: "Doe", interests: [{id: 1, name: "Hiking"}], location: {country: "Canada", region: "Ontario", city: "Toronto", streetAddress: "123 Main St"}, privacyLevel: 2, employment: {workplace: "Example Corp", position: "Example Position"}, skills: [{id: 1, name: "JavaScript"}, {id: 2, name: "Python"}]});//Hardcoded for testing purposes.
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
        {/* First and last name likely will not be modifiable without contacting the theoretical app support team. Hardcoded for now*/}
        <label >LastName</label>
        <input type="text" placeholder="Last Name" defaultValue = {user.lastName} onChange={(e) => setTempUser({...tempUser, lastName: e.target.value})}/>

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
        <input type="number" placeholder="0-10" defaultValue={user.privacyLevel || 3} onChange={(e) => setTempUser({...tempUser, privacyLevel: e.target.value})}/>

        <button type="submit" onClick={() => {
            saveProfile();
        }}>Save Profile</button>
        <button type="cancel">Cancel</button>

        </form>

        </div>
        )//LF: 10 privacy levels may be too many to program. Was thinking around 3-5 levels, but we can talk about it. This is a test form anyway of course.
        //LF: Skills and interests will likely be a map or array of HTML components that the user can add to in a 'edit profile' page.
        //LF: Editing password ask for the old password once then the new password twice.
}
export default ProfileEdit;