import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { matches } from "../util/api.js";
import "./ProfileTest.css";

function PotentialMatches({ user }) {
  const [potentialMatches, setPotentialMatches] = useState(null);

  useEffect(() => {
    const fetchPotentialMatches = async () => {
      try {
        const res = await matches.getPotentialUserList();
        debugger;

        if (Array.isArray(res) && res.length > 0) {
          setPotentialMatches(res);
          return;
        }

        // fallback dummy data if API returns null / empty
        setPotentialMatches([
          {
            id: 1,
            username: "amna01",
            firstName: "Amna",
            lastName: "Ali",
            displayedGender: "Female",
            location: { city: "Lahore", region: "Punjab", country: "Pakistan" },
            interests: ["Travel", "Books", "Music"],
            skills: ["Writing", "Communication"],
          },
          {
            id: 2,
            username: "hamza_dev",
            firstName: "Hamza",
            lastName: "Khan",
            displayedGender: "Male",
            location: { city: "Karachi", region: "Sindh", country: "Pakistan" },
            interests: ["Coding", "Gaming", "Movies"],
            skills: ["React", "Node.js"],
          },
        ]);
      } catch (err) {
        toast.error("Failed to fetch potential matches. Showing dummy data.");

        setPotentialMatches([
          {
            id: 1,
            username: "amna01",
            firstName: "Amna",
            lastName: "Ali",
            displayedGender: "Female",
            location: { city: "Lahore", region: "Punjab", country: "Pakistan" },
            interests: ["Travel", "Books", "Music"],
            skills: ["Writing", "Communication"],
          },
          {
            id: 2,
            username: "hamza_dev",
            firstName: "Hamza",
            lastName: "Khan",
            displayedGender: "Male",
            location: { city: "Karachi", region: "Sindh", country: "Pakistan" },
            interests: ["Coding", "Gaming", "Movies"],
            skills: ["React", "Node.js"],
          },
        ]);
      }
    };

    fetchPotentialMatches();
  }, [user]);

  if (potentialMatches === null) {
    return <div>Loading potential matches...</div>;
  }

  if (potentialMatches.length === 0) {
    return <div>No potential matches found.</div>;
  }

  return (
    <div className="matches_container ">
      <h1>Potential Match List</h1>

      <table className="match-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Gender</th>
            <th>Location</th>
            <th>Interests</th>
            <th>Skills</th>

            {/* Column for sending match requests */}
            <th>Match?</th>
          </tr>
        </thead>
        <tbody>
          {potentialMatches.map((profile, i) => (
            <tr key={profile.id || profile.username || i}>
              <td>{`${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "N/A"}</td>
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
              <td>{Array.isArray(profile.interests) ? profile.interests.join(", ") : "N/A"}</td>
              <td>{Array.isArray(profile.skills) ? profile.skills.join(", ") : "N/A"}</td>
              {/* Match Button */}
              {/* TO DO: Add function SendMatchRequest to user onClick */}
              <td>
                <button>Request Match</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PotentialMatches;