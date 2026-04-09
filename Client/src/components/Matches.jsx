import "./ProfileTest.css";
import * as api from "../util/api.js";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function MatchesList({ user }) {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      if (!user?.username) {
        setMatches([]);
        return;
      }

      const dummyMatches = [
        {
          id: 1,
          username: "sarah01",
          firstName: "Sarah",
          lastName: "Khan",
          age: 24,
          displayedGender: "Female",
          bio: "Love traveling, coffee, and deep conversations.",
          location: {
            city: "Lahore",
            region: "Punjab",
            country: "Pakistan",
          },
          interests: ["Travel", "Music", "Photography"],
          skills: ["React", "Communication", "Design"],
        },
        {
          id: 2,
          username: "ali_dev",
          firstName: "Ali",
          lastName: "Raza",
          age: 27,
          displayedGender: "Male",
          bio: "Frontend developer who enjoys gaming and hiking.",
          location: {
            city: "Karachi",
            region: "Sindh",
            country: "Pakistan",
          },
          interests: ["Gaming", "Hiking", "Tech"],
          skills: ["JavaScript", "CSS", "Problem Solving"],
        },
        {
          id: 3,
          username: "zoyaWrites",
          firstName: "Zoya",
          lastName: "Ahmed",
          age: 25,
          displayedGender: "Female",
          bio: "Book lover and content writer. Always curious.",
          location: {
            city: "Islamabad",
            region: "ICT",
            country: "Pakistan",
          },
          interests: ["Reading", "Writing", "Art"],
          skills: ["Content Writing", "SEO", "Research"],
        },
      ];

      try {
        const res = await api.matches.getMatches(user.username);

        if (Array.isArray(res) && res.length > 0) {
          setMatches(res);
        } else {
          setMatches(dummyMatches);
        }
      } catch (err) {
        toast.error("Failed to load matches. Showing dummy data.");
        setMatches(dummyMatches);
      }
    };

    loadMatches();
  }, [user?.username]);

  if (matches === null) {
    return <div>Loading...</div>;
  }

  if (matches.length === 0) {
    return <div>No matches found.</div>;
  }

  return (
    <div className="matches_container">
      <h1>Looking For Love Profile Match List</h1>

      <table className="match-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Location</th>
            <th>Bio</th>
            <th>Interests</th>
            <th>Skills</th>

            {/* Added button for review */}
            <th>Review?</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((profile, i) => (
            <tr key={profile.id || profile.username || i}>
              <td>{`${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "N/A"}</td>
              <td>{profile.username || "N/A"}</td>
              <td>{profile.age || "N/A"}</td>
              <td>{profile.displayedGender || "N/A"}</td>
              <td>
                {[profile.location?.city, profile.location?.region, profile.location?.country]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </td>
              <td>{profile.bio || "N/A"}</td>
              <td>{Array.isArray(profile.interests) ? profile.interests.join(", ") : "N/A"}</td>
              <td>{Array.isArray(profile.skills) ? profile.skills.join(", ") : "N/A"}</td>
              {/* Button for contact and review */}
              {/* TO DO: Add handleViewContactInfo and handleReview functions onClick */}
              <td>
                <button>View Contact Information</button>
                <button>Leave Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatchesList;