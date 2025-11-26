import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // <-- useNavigate added
import "../styles/LoginRegister.css";

const API_BASE = "http://localhost:5000";

export default function LoginRegister({ onLogin }) {
  const navigate = useNavigate(); // <-- initialize navigate
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  // ---------------- Sync with App.jsx logout ----------------
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ---------------- Validation ----------------
  const validateInputs = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z!@#$%^&*]{8,}$/;

    if (!emailRegex.test(email))
      return "Email must be a valid Gmail address (example@gmail.com).";
    if (!isLogin && !usernameRegex.test(username))
      return "Username must be at least 3 characters and contain only letters, numbers, or underscores.";
    if (!passwordRegex.test(password))
      return "Password must be at least 8 characters, include uppercase, lowercase, and one special character (!@#$%^&*), no numbers.";

    return null;
  };

  // ---------------- Handle Form Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const error = validateInputs();
    if (error) {
      setMessage(error);
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email, password }
        : { email, username, password };

      const res = await axios.post(`${API_BASE}${endpoint}`, payload);

      if (res.data) {
        // Save token & user locally
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setUser(res.data.user);

        if (onLogin) {
          onLogin(res.data.user, res.data.token);
        }

        setMessage(isLogin ? "Login successful!" : "Registration successful!");

        // ✅ Redirect to home page after login/register
        navigate("/");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setMessage(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Handle Logout ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    if (onLogin) onLogin(null, null);
    setMessage("Logged out successfully!");

    // ✅ Redirect to home page after logout
    navigate("/");
  };

  // ---------------- Login/Register Form ----------------
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email (must be @gmail.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
