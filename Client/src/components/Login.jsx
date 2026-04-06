import "./ProfileTest.css";
import { useState } from "react";
import toast from "react-hot-toast";
import * as api from "../util/api.js";

function Login({ setUser, goToSignup }) {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      toast.error("Enter username & password");
      return;
    }

    setLoading(true);

    try {
      const data = await api.profile.login({
        username: form.username,
        password: form.password
      });

      if (data) {
        toast.success("Login successful");
        setUser(data);
      }

    } catch (e) {
      toast.error(e.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Looking For Love</h1>
      <h2>Login</h2>

      {loading && <div className="spinner">Loading...</div>}

      <form className="form">
        <label>Username</label>
        <input
          type="text"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <label>Password</label>
        <input
          type="password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="button" onClick={handleLogin}>
          Login
        </button>

        <button type="button" onClick={goToSignup}>
          Go to Signup
        </button>
      </form>
    </div>
  );
}

export default Login;