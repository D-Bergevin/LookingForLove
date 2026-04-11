function ProfileView({ user }) {
    if (!user) {
        return <div>Loading...</div>
    }
    return (
        <div className="matches_container">
            <h1>Looking For Love Profile View</h1>
            <h2>View Profile</h2>
            <div className="profile-text-center">
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Name: {user.firstName} {user.lastName}</p>
                <p>Skills: {user.skills.map(skill => skill).join(", ")}</p>
                <p>Interests: {user.interests.map(interest => interest).join(", ")}</p>
                <p>Location: {user.location.country}, {user.location.region}, {user.location.city}, {user.location.address}</p>
                <p>Workplace: {user.employment.workplace}</p>
                <p>Position: {user.employment.position}</p>
            </div>

        </div>
    );
}
export default ProfileView;