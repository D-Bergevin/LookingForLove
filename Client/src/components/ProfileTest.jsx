import "./ProfileTest.css";

function ProfileTest(){
    return(
    <div className="container">
        <h1>Looking For Love Profile Creation</h1>
        <h2>Create Profile</h2>

        <form className="form">

        <label >ID</label>
        <input type="text" placeholder="User ID"/>

        <label >Username</label>
        <input type="text" placeholder="Username"/>

        <label >Email</label>
        <input type="text" placeholder="Email"/>

        <label >Password</label>
        <input type="text" placeholder="Password"/>

        <label >FirstName</label>
        <input type="text" placeholder="First Name"/>

        <label >LastName</label>
        <input type="text" placeholder="Last Name"/>

        <label >Skills</label>
        <input type="text" placeholder="Type Skills Here"/>

        <label >Interests</label>
        <input type="text" placeholder="Type Interests Here"/>

        <label >Location</label>
        <input type="text" placeholder="City / Area"/>

        <label >Workplace</label>
        <input type="text" placeholder="Company"/>

        <label >Position</label>
        <input type="text" placeholder="Job Title / Position"/>

        <label >PrivacyLevel</label>
        <input type="text" placeholder="0 - 10"/>

        <button type="submit">Create New Profile</button>

        </form>

        </div>
        )
}

export default ProfileTest;