import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import FlowchartsInfo from "./pages/FlowchartsInfo";
import Plans from "./pages/Plans";
import Editor from "./components/Editor";
import FlowRenderer from "./components/FlowRenderer";
import Dashboard from "./pages/Dashboard";
import LoginRegister from "./pages/LoginRegister";
import Upgrade from "./pages/Upgrade";
import "./styles.css";

export default function App() {
  const [graph, setGraph] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Load user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ Handle Login
  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Handle Logout (works globally)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ Handle Plan Upgrade
  const handleUpgrade = (newPlan) => {
    if (!user) return;
    const updatedUser = { ...user, plan: newPlan };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <div className="app flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-3">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/flowcharts" element={<FlowchartsInfo />} />
          <Route path="/about" element={<About />} />
          <Route path="/plans" element={<Plans />} />

          {/* Protected Editor */}
          <Route
            path="/editor"
            element={
              user ? (
                <div className="grid grid-cols-[380px_1fr] gap-3">
                  <Editor onGraph={setGraph} />
                  <FlowRenderer graph={graph} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
          />

          {/* Upgrade Plan */}
          <Route
            path="/upgrade"
            element={
              <Upgrade user={user} onUpgrade={handleUpgrade} />
            }
          />

          {/* Login/Register */}
          <Route
            path="/login"
            element={<LoginRegister onLogin={handleLogin} onLogout={handleLogout} />}
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <h2 className="text-center text-red-600 font-semibold">
                Page Not Found
              </h2>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
