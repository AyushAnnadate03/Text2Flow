import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/LoginRegister.css"; // Same UI as Login/Register

export default function Upgrade({ user, onUpgrade }) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.plan || "";

  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleUpgrade = () => {
    setLoading(true);
    setMessage("");

    if (!username || !email) {
      setMessage("Username and Email are required.");
      setLoading(false);
      return;
    }

    // ✅ Simulate upgrade (in real app you can call API)
    const updatedUser = { ...user, plan: selectedPlan };
    if (onUpgrade) onUpgrade(selectedPlan);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setMessage(`Plan upgraded to ${selectedPlan} successfully!`);
    setLoading(false);

    // Redirect to dashboard after 2s
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Upgrade to {selectedPlan}</h2>
        <p>Confirm your details before upgrading your plan.</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleUpgrade} disabled={loading}>
          {loading ? "Upgrading..." : `Upgrade to ${selectedPlan}`}
        </button>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
