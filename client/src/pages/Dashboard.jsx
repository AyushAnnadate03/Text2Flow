import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Dashboard({ user }) {
  const [diagrams, setDiagrams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/diagrams`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDiagrams(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user]);

  const handleUpgradeClick = () => {
    navigate("/upgrade"); // Navigate to Upgrade page
  };

  return (
    <div className="dashboard-page">
      <h2>Welcome, {user?.username || user?.email || "Guest"}!</h2>

      <p>Your current plan:</p>
      <div className="plan-info">
        <h3>{user?.plan || "Free"}</h3>

        {user?.plan === "Free" && (
          <>
            <p>Basic text-to-flowchart conversion</p>
            <p>Standard parsing support</p>
            <p>Upgrade for AI-powered parsing and priority support!</p>
            <button className="upgrade-btn" onClick={handleUpgradeClick}>
              Upgrade Plan
            </button>
          </>
        )}

        {user?.plan === "Pro" && (
          <>
            <p>AI-powered parsing enabled</p>
            <p>Enhanced accuracy and priority support</p>
          </>
        )}

        {user?.plan === "Premium" && (
          <>
            <p>Advanced AI features</p>
            <p>Team collaboration enabled</p>
            <p>Priority support</p>
          </>
        )}
      </div>
    </div>
  );
}
