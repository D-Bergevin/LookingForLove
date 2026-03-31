import "./ProfileTest.css";
import InterestDisplay from "./InterestDisplay.jsx";
import SkillDisplay from "./SkillDisplay.jsx";
import { useState } from "react";
import toast from "react-hot-toast";
import * as api from "../util/api.js";

function ProfileEdit(props) {
  const [tempUser, setTempUser] = useState(props.user);
  const [existingUser, setExistingUser] = useState(props.user);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    setLoading(true);
    try {
      if(tempUser.newPassword && tempUser.newPassword !== tempUser.confirmNewPassword) {
        toast.error("New password and confirm password do not match");
        setLoading(false);
        return;
      }
      if(tempUser.confirmNewPassword === tempUser.newPassword) {
        tempUser.password = tempUser.confirmNewPassword;
      }
      let data = null;
      if(JSON.stringify(existingUser) !== JSON.stringify(tempUser)) {
         data = await api.profile.updateProfile(tempUser);
      } else {
         data = await api.profile.createProfile(tempUser);
      }
     if(data){
      toast.success("Profile saved successfully!");
     } else {
       toast.error("Failed to save profile");
     }
    } catch (e) {
      toast.error(e.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Edit Profile</h2>

      {loading && <div className="spinner">Saving...</div>}

      <form className="form">
        {/* Username */}
        <label>Username</label>
        <input
          type="text"
          defaultValue={props.user.username}
          onChange={(e) =>
            setTempUser({ ...tempUser, username: e.target.value })
          }
        />

        {/* Email */}
        <label>Email</label>
        <input
          type="text"
          defaultValue={props.user.email}
          onChange={(e) =>
            setTempUser({ ...tempUser, email: e.target.value })
          }
        />

        {/* Passwords */}
        <label>Old Password</label>
        <input type="password" placeholder="Password" 
           onChange={(e) =>
            setTempUser({ ...tempUser, password: e.target.value })
          }/>

        <label>New Password</label>
        <input type="password" placeholder="NewPassword"
          onChange={(e) =>
            setTempUser({ ...tempUser, newPassword: e.target.value })
          }
         />

        <label>Confirm New Password</label>
        <input type="password" placeholder="ConfirmNewPassword" 
           onChange={(e) =>
            setTempUser({ ...tempUser, confirmNewPassword: e.target.value })
          }/>

        {/* First & Last Name */}
        <label>First Name</label>
        <input
          type="text"
          defaultValue={props.user.firstname}
          onChange={(e) =>
            setTempUser({ ...tempUser, firstname: e.target.value })
          }
        />

        <label>Last Name</label>
        <input
          type="text"
          defaultValue={props.user.lastname}
          onChange={(e) =>
            setTempUser({ ...tempUser, lastname: e.target.value })
          }
        />

        {/* Skills */}
        <label>Skills</label>
        {tempUser?.skills?.map((skill, i) => (
          <SkillDisplay
            key={i}
            skill={skill}
            setSkills={(updater) =>
              setTempUser({
                ...tempUser,
                skills:
                  typeof updater === "function"
                    ? updater(tempUser.skills)
                    : updater,
              })
            }
          />
        ))}
        <input
          type="text"
          placeholder="Add skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (!newSkill.trim()) return;
            setTempUser({
              ...tempUser,
              skills: [...tempUser.skills, newSkill],
            });
            setNewSkill("");
          }}
        >
          Add Skill
        </button>

        {/* Interests */}
        <label>Interests</label>
        {tempUser?.interests?.map((interest, i) => (
          <InterestDisplay
            key={i}
            interest={interest}
            setInterests={(updater) =>
              setTempUser({
                ...tempUser,
                interests:
                  typeof updater === "function"
                    ? updater(tempUser.interests)
                    : updater,
              })
            }
          />
        ))}
        <input
          type="text"
          placeholder="Add interest"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (!newInterest.trim()) return;
            setTempUser({
              ...tempUser,
              interests: [...tempUser.interests, newInterest],
            });
            setNewInterest("");
          }}
        >
          Add Interest
        </button>

        {/* Location */}
        <label>Country</label>
        <input
          type="text"
          defaultValue={props.user.location.Country}
          onChange={(e) =>
            setTempUser({
              ...tempUser,
              location: { ...tempUser.location, Country: e.target.value },
            })
          }
        />

        <label>Region</label>
        <input
          type="text"
          defaultValue={props.user.location.Region}
          onChange={(e) =>
            setTempUser({
              ...tempUser,
              location: { ...tempUser.location, Region: e.target.value },
            })
          }
        />

        <label>Address</label>
        <input
          type="text"
          defaultValue={props.user.location.Address}
          onChange={(e) =>
            setTempUser({
              ...tempUser,
              location: { ...tempUser.location, Address: e.target.value },
            })
          }
        />

        {/* Employment */}
        <label>Workplace</label>
        <input
          type="text"
          defaultValue={props.user.employment.workplace}
          onChange={(e) =>
            setTempUser({
              ...tempUser,
              employment: { ...tempUser.employment, workplace: e.target.value },
            })
          }
        />

        <label>Position</label>
        <input
          type="text"
          defaultValue={props.user.employment.position}
          onChange={(e) =>
            setTempUser({
              ...tempUser,
              employment: { ...tempUser.employment, position: e.target.value },
            })
          }
        />

        {/* Privacy Level */}
        <label>Privacy Level</label>
        <input
          type="number"
          defaultValue={props.user.privacyLevel}
          onChange={(e) =>
            setTempUser({ ...tempUser, privacyLevel: Number(e.target.value) })
          }
        />

        {/* Displayed Gender */}
        <label>Displayed Gender</label>
        <select
          value={tempUser.displayedGender || ""}
          onChange={(e) =>
            setTempUser({ ...tempUser, displayedGender: e.target.value })
          }
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>

        {/* Dating Preference */}
        <label>Dating Preference</label>
        <select
          value={tempUser.datingPreference || ""}
          onChange={(e) =>
            setTempUser({ ...tempUser, datingPreference: e.target.value })
          }
        >
          <option value="">Select Preference</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="A">All</option>
        </select>

        {/* Action Buttons */}
        <button type="button" onClick={saveProfile}>
          Save Profile
        </button>
        <button type="button">Cancel</button>
      </form>
    </div>
  );
}

export default ProfileEdit;