import React from "react";
import "../styles/About.css";
import { AiOutlineRobot, AiOutlineUser, AiOutlineDollar } from "react-icons/ai";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="hero">
        <h1>About Text2Flow</h1>
        <p>
          Text2Flow is an AI-powered platform that transforms your ideas into
          clear, professional flowcharts within seconds. Whether you are a
          student, developer, or professional, our tool makes diagramming
          effortless.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="mission-vision">
        <div className="card">
          <h2>Our Mission</h2>
          <p>
            To simplify complex ideas by providing an intuitive tool that
            converts text into structured flowcharts, helping students and
            professionals visualize processes better.
          </p>
        </div>
        <div className="card">
          <h2>Our Vision</h2>
          <p>
            To become the go-to global platform for AI-driven visualization,
            enabling seamless communication of concepts across industries and
            education.
          </p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="offer-section">
        <h2>What We Offer</h2>
        <div className="offer-cards">
          <div className="offer-card">
            <AiOutlineRobot className="icon" />
            <h3>AI Integration</h3>
            <p>
              Automatically generate flowcharts from plain text using advanced
              AI algorithms.
            </p>
          </div>
          <div className="offer-card">
            <AiOutlineUser className="icon" />
            <h3>User-Friendly</h3>
            <p>
              Simple, clean, and modern UI designed for students and working
              professionals alike.
            </p>
          </div>
          <div className="offer-card">
            <AiOutlineDollar className="icon" />
            <h3>Flexible Plans</h3>
            <p>
              Choose from free and premium plans that fit your academic or
              professional needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
