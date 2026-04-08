function ProfileView({ user }) {
    if (!user) {
        return <div>Loading...</div>
    }
    return (
        <div className="container">
            <h1>Looking For Love Profile View</h1>
            <h2>View Profile</h2>

            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Skills: {user.skills.map(skill => skill.name).join(", ")}</p>
            <p>Interests: {user.interests.map(interest => interest).join(", ")}</p>
            <p>Location: {user.location.country}, {user.location.region}, {user.location.city}, {user.location.address}</p>
            <p>Workplace: {user.employment.workplace}</p>
            <p>Position: {user.employment.position}</p>
        </div>
    );
}
export default ProfileView;