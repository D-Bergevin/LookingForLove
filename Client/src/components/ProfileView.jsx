import { useState } from "react";
function ProfileView() {
    const [user] = useState({id: 1, username: "JohnDoe", email: "johndoe@example.com", firstName: "John", lastName: "Doe", interests: [{id: 1, name: "Hiking"}], location: {country: "Canada", region: "Ontario", city: "Toronto", streetAddress: "123 Main St"}, privacyLevel: 2, employment: {workplace: "Example Corp", position: "Example Position"}, skills: [{id: 1, name: "JavaScript"}, {id: 2, name: "Python"}]});//Hardcoded for testing purposes.
    //LF: On the server side, if the privacy level is high, the server will only send the data that the said user would want displayed back to the client.
    //LF: Then we would have checks to account for those null/missing values. For example, if workplace is null we could just indicate to the viewing user that the information is hidden due to privacy settings.
    return (
        <div className="container">
            <h1>Looking For Love Profile View</h1>
            <h2>View Profile</h2>

            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Skills: {user.skills.map(skill => skill.name).join(", ")}</p>
            <p>Interests: {user.interests.map(interest => interest.name).join(", ")}</p>
            <p>Location: {user.location.country}, {user.location.region}, {user.location.city}, {user.location.streetAddress}</p>
            <p>Workplace: {user.employment.workplace}</p>
            <p>Position: {user.employment.position}</p>
        </div>
    );
}
export default ProfileView;