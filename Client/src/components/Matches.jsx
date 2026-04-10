import "./ProfileTest.css";
import * as api from "../util/api.js";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function Matches({ user }) {
  const [matches, setMatches] = useState(null);

  //added states for match reviews and ratings
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState({})
  const [submittingReview, setSubmittingReview] = useState(false);


  useEffect(() => {
    const loadMatches = async () => {
      if (!user?.username) {
        setMatches([]);
        return;
      }

      try {
        const res = await api.matches.getMatches(user.username);

        setMatches(Array.isArray(res) ? res : [])
      } catch (err) {
        toast.error("Failed to load matches.");
        setMatches([]);
      }
    };

    loadMatches();
  }, [user?.username]);

  //saving reviews in local storage for now
  useEffect(() => {
    const savedReviews = localStorage.getItem("matchReviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("matchReviews", JSON.stringify(reviews));
  }, [reviews]);

  const openReview = (profile) => {
    setSelectedMatch(profile);

    if (reviews[profile.username]) {
      setRating(reviews[profile.username].rating);
      setComment(reviews[profile.username].comment);
    }
    else {
      setRating(0);
      setComment("");
    }
  };

  const cancelReview = () => {
    setSelectedMatch(null);
    setRating(0);
    setComment("");
  }

  const submitReview = () => {
    if (!selectedMatch) return;

    if (rating < 1 || rating > 5) {
      toast.error("Invalid rating select a rating from 1 - 5:)");
      return;
    }

    try {
      setSubmittingReview(true);

      //save review locally
      setReviews((prev) => ({
        ...prev,
        [selectedMatch.username]: {
          rating,
          comment,
        },
      }));

      toast.success("Review saved");
      setSelectedMatch(null);
      setRating(0);
      setComment("");
    }

    catch (err) {
      toast.error("Failed to save review :(");
    }

    finally {
      setSubmittingReview(false)
    }
  };

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
            <th>Review</th>
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
              <td>
                <button type="button" onClick={() => openReview(profile)}>{reviews[profile.username] ? "Edit Review" : "Leave Review"}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* review form for selected user */}
      {selectedMatch && (
        <div className="review-box">
          <h2>
            Review {selectedMatch.firstName} {selectedMatch.lastName}
          </h2>

          {/* cool star rating */}
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" className={star <= rating ? "star active" : "star"} onClick={() => setRating(star)}>
                ★
              </button>
            ))}
          </div>

          <textarea rows="4" placeholder="Review" value={comment} onChange={(e) => setComment(e.target.value)} />

          <div>
            <button onClick={submitReview} disabled={submittingReview}>
              {submittingReview ? "Saving..." : "Submit Review"}
            </button>
            <button onClick={cancelReview}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Matches;