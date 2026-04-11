import "./ProfileTest.css";
import { useState } from "react";
import toast from "react-hot-toast";
import * as api from "../util/api.js";

function Signup({ goToLogin }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = () => {
    const p = form.password;
    if (p.length < 6) return "Weak";
    if (p.match(/[A-Z]/) && p.match(/[0-9]/) && p.length >= 8) return "Strong";
    return "Medium";
  };

  const isValid =
    form.username &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword;

  const handleSignup = async () => {
    if (!isValid) {
      toast.error("Fix errors before submitting");
      return;
    }

    setLoading(true);

    try {
      // Call API
      const data = await api.profile.signup({
        username: form.username,
        email: form.email,
        password: form.password
      });

      if (data) {
        toast.success("Account created successfully!");
        goToLogin();
      }
    
    } catch (e) {
      toast.error("Signup failed - Duplicate email or username");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Looking For Love</h1>
      <h2>Signup</h2>

      {loading && <div className="spinner">Loading...</div>}

      <form className="form">
        {/* Username */}
        <label>Username</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        {/* Email */}
        <label>Email</label>
        <input
          type="text"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <label>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <span
            style={{ position: "absolute", right: "10px", top: "8px", cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </span>
        </div>

        {/* Strength */}
        {form.password && (
          <span
            style={{
              color: getStrength() === "Strong" ? "green" : getStrength() === "Medium" ? "orange" : "red"
            }}
          >
            Strength: {getStrength()}
          </span>
        )}

        {/* Confirm Password */}
        <label>Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        {/* Live match check */}
        {form.confirmPassword && (
          <span style={{ color: form.password === form.confirmPassword ? "green" : "red" }}>
            {form.password === form.confirmPassword ? "Passwords match" : "Passwords do not match"}
          </span>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSignup}
          disabled={!isValid}
          style={{
            opacity: isValid ? 1 : 0.5,
            cursor: isValid ? "pointer" : "not-allowed"
          }}
        >
          Signup
        </button>

        <button type="button" onClick={goToLogin}>
          Go to Login
        </button>
      </form>
    </div>
  );
}

export default Signup;