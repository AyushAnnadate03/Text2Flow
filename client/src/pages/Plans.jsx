import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Plans.css";


const plansData = [
  {
    title: "Free",
    description:
      "Basic text-to-flowchart conversion with standard parsing capabilities.",
    features: ["Basic parsing", "Standard support"],
  },
  {
    title: "Pro",
    description:
      "Enhanced AI-powered parsing for more accurate flowcharts with priority support.",
    features: ["AI parsing", "Priority support", "Enhanced accuracy"],
  },
  {
    title: "Premium",
    description:
      "Advanced AI features for professional use, including team collaboration and priority assistance.",
    features: ["Advanced AI", "Team collaboration", "Priority support"],
  },
];
export default function Plans() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const prevCard = () => {
    setCurrentIndex((prev) => (prev === 0 ? plansData.length - 1 : prev - 1));
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev === plansData.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="plans-page">
      <div className="hero">
        <h2>Choose Your Plan</h2>
        <p>Pick the plan that fits your needs and start creating flowcharts!</p>
      </div>

      <div className="plan-carousel">
        <button className="switch-btn" onClick={prevCard}>
          &lt;
        </button>

        <div className="plans-wrapper">
          <div
            className="plans-inner"
            style={{ transform: `translateX(-${currentIndex * 70}%)` }}
          >
            {plansData.map((plan, index) => (
              <div
                key={index}
                className={`plan-card ${index === currentIndex ? "active" : ""}`}
              >
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="upgrade-btn-wrapper">
                  {plan.title !== "Free" && (
                    <button
                      className="upgrade-btn"
                      onClick={() =>
                        navigate("/upgrade", { state: { plan: plan.title } })
                      }
                    >
                      Upgrade to {plan.title}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="switch-btn" onClick={nextCard}>
          &gt;
        </button>
      </div>
    </div>
  );
}
