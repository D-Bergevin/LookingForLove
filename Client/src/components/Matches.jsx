import "./Profile.css";
import * as api from "../util/api.js";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function Matches({ user }) {
  const [matches, setMatches] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState({});
  const [submittingReview, setSubmittingReview] = useState(false);

  const [contactModalMatch, setContactModalMatch] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingContactInfo, setLoadingContactInfo] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      if (!user?.username) {
        setMatches([]);
        return;
      }

      try {
        const res = await api.matches.getMatches(user.username);
        setMatches(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Failed to load matches:", error);
        toast.error("Failed to load matches.");
        setMatches([]);
      }
    };

    loadMatches();
  }, [user?.username]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!user?.username) {
        setReviews({});
        return;
      }

      try {
        const savedReviews = await api.matches.getReviews(user.username);
        if (savedReviews && typeof savedReviews === "object") {
          setReviews(savedReviews);
        } else {
          setReviews({});
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setReviews({});
      }
    };

    loadReviews();
  }, [user?.username]);

  useEffect(() => {
    localStorage.setItem("matchReviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (!selectedMatch && !contactModalMatch) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        cancelReview();
        closeContactModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedMatch, contactModalMatch]);

  const openReview = (profile) => {
    setSelectedMatch(profile);

    const existingReview = reviews[profile.username];
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || "");
    } else {
      setRating(0);
      setComment("");
    }
  };

  const cancelReview = () => {
    setSelectedMatch(null);
    setRating(0);
    setComment("");
  };

  const submitReview = async () => {
    if (!selectedMatch) return;

    if (rating < 1 || rating > 5) {
      toast.error("Select a rating from 1 to 5.");
      return;
    }

    try {
      setSubmittingReview(true);

      await api.matches.postReview(
        user.username,
        selectedMatch.username,
        { rating, comment }
      );

      setReviews((prev) => ({
        ...prev,
        [selectedMatch.username]: {
          rating,
          comment,
        },
      }));

      toast.success("Review saved");
      cancelReview();
    } catch (error) {
      console.error("Failed to save review:", error);
      toast.error("Failed to save review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const openContactModal = async (profile) => {
    try {
      setContactModalMatch(profile);
      setContactInfo(null);
      setLoadingContactInfo(true);

      const data = await api.matches.getMutualMatchContact(profile.username);
      setContactInfo(data);
    } catch (error) {
      console.error("Failed to load contact info:", error);
      toast.error("Failed to load contact info.");
      setContactInfo(null);
    } finally {
      setLoadingContactInfo(false);
    }
  };

  const closeContactModal = () => {
    setContactModalMatch(null);
    setContactInfo(null);
    setLoadingContactInfo(false);
  };

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const renderContactInfo = () => {
    if (loadingContactInfo) {
      return <p>Loading contact info...</p>;
    }

    if (!contactInfo || typeof contactInfo !== "object") {
      return <p>No contact info found.</p>;
    }

    const entries = Object.entries(contactInfo).filter(([_, value]) => {
      return (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        ["string", "number", "boolean"].includes(typeof value)
      );
    });

    if (entries.length === 0) {
      return <p>No contact info available.</p>;
    }

    return (
      <div className="contact-info-list">
        {entries.map(([key, value]) => (
          <p key={key}>
            <strong>{formatLabel(key)}:</strong> {String(value)}
          </p>
        ))}
      </div>
    );
  };

  if (matches === null) {
    return <div>Loading Mutual Matches...</div>;
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
            <th>Gender</th>
            <th>Location</th>
            <th>Interests</th>
            <th>Skills</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((profile, i) => (
            <tr key={profile.id || profile.username || i}>
              <td>
                {`${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "N/A"}
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
                {Array.isArray(profile.interests)
                  ? profile.interests.join(", ")
                  : "N/A"}
              </td>
              <td>
                {Array.isArray(profile.skills)
                  ? profile.skills.join(", ")
                  : "N/A"}
              </td>
              <td>
                <div className="match-actions">
                  <button
                    type="button"
                    onClick={() => openReview(profile)}
                  >
                    {reviews[profile.username] ? "Edit Review" : "Leave Review"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openContactModal(profile)}
                  >
                    View Contact
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMatch && (
        <div className="modal-overlay" onClick={cancelReview}>
          <div
            className="review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              Review {selectedMatch.firstName} {selectedMatch.lastName}
            </h2>

            <div className="star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= rating ? "star active" : "star"}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              rows="4"
              placeholder="Write your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="review-actions">
              <button
                type="button"
                onClick={submitReview}
                disabled={submittingReview}
              >
                {submittingReview ? "Saving..." : "Submit Review"}
              </button>

              <button
                type="button"
                onClick={cancelReview}
                disabled={submittingReview}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {contactModalMatch && (
        <div className="modal-overlay" onClick={closeContactModal}>
          <div
            className="review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              Contact Info for {contactModalMatch.firstName} {contactModalMatch.lastName}
            </h2>

            {renderContactInfo()}

            <div className="review-actions">
              <button
                type="button"
                onClick={closeContactModal}
                disabled={loadingContactInfo}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Matches;