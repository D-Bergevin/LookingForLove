import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { matches } from "../util/api.js";
import "./ProfileTest.css";

function PotentialMatches({ user }) {
  const [potentialMatches, setPotentialMatches] = useState(null);

  const getSharedInterests = (currentUser, profile) => {
    const userInterests = Array.isArray(currentUser?.interests) ? currentUser.interests : [];
    const profileInterests = Array.isArray(profile?.interests) ? profile.interests : [];

    return profileInterests.filter((interest) =>
      userInterests.includes(interest)
    );
  };

  useEffect(() => {
    const fetchPotentialMatches = async () => {
      if (!user?.username) {
        setPotentialMatches([]);
        return;
      }

      try {
        const res = await matches.getMatches(user.username);

        if (Array.isArray(res)) {
          setPotentialMatches(res);
        } else {
          setPotentialMatches([]);
        }
      } catch (err) {
        console.error("Failed to fetch potential matches:", err);
        toast.error(err.message || "Failed to fetch potential matches");
        setPotentialMatches([]);
      }
    };

    fetchPotentialMatches();
  }, [user]);

  //TO DO put in match request logic
  const requestMatch = async (profile) => {
    toast("Match request feature is not connected yet.");
  };

  if (potentialMatches === null) {
    return <div>Loading Potential Matches...</div>;
  }

  if (potentialMatches.length === 0) {
    return <div>No potential matches found.</div>;
  }

  return (
    <div className="matches_container">
      <h1>Potential Match List</h1>

      <table className="match-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Gender</th>
            <th>Location</th>
            <th>Shared Interests</th>
            <th>All Interests</th>
            <th>Skills</th>
            <th>Match?</th>
          </tr>
        </thead>
        <tbody>
          {potentialMatches.map((profile, i) => {
            const sharedInterests = getSharedInterests(user, profile);
            return (
              <tr key={profile.username || i}>
                <td>
                  {`${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
                    "N/A"}
                </td>
                <td>{profile.username || "N/A"}</td>
                <td>{profile.displayedGender || "N/A"}</td>
                <td>
                  {[
                    profile.location?.city,
                    profile.location?.region,
                    profile.location?.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </td>
                <td>
                  {sharedInterests.length > 0 ? sharedInterests.join(", ") : "None"}
                </td>
                <td>
                  {Array.isArray(profile.interests) ? profile.interests.join(", ") : "N/A"}
                </td>
                <td>
                  {Array.isArray(profile.skills) ? profile.skills.join(", ") : "N/A"}
                </td>
                <td>
                  <button onClick={() => requestMatch(profile)}>
                    Request Match
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PotentialMatches;