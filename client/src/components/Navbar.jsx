import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const linkStyle = { color: "white", textDecoration: "none" };
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear local storage and user session
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // ✅ Trigger parent logout handler if provided
    if (onLogout) onLogout(null, null);

    // ✅ Redirect to login page
    navigate("/login");
  };

  return (
    <nav style={{ background: "#008080", padding: "12px", color: "white" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <h2 style={{ margin: 0 }}>Text2Flow</h2>

        {/* Links */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link to="/flowcharts" style={linkStyle}>
            Flowcharts
          </Link>

          {/* Editor link visible only if logged in */}
          {user && (
            <Link to="/editor" style={linkStyle}>
              Editor
            </Link>
          )}

          <Link to="/about" style={linkStyle}>
            About
          </Link>
          <Link to="/plans" style={linkStyle}>
            Plans
          </Link>

          {/* User-related links */}
          {user ? (
            <>
              <Link to="/dashboard" style={linkStyle}>
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  ...linkStyle,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={linkStyle}>
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
