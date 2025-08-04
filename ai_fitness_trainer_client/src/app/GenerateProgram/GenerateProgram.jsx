import React, { useState } from 'react';
import {
  Dumbbell,
  Flame,
  HeartPulse,
  Activity,
  StretchHorizontal,
  Settings
} from "lucide-react";
import './GenerateProgram.css';

function GenerateProgram() {
  const [selectedGoal, setGoal] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("");

  const goalList = [
    { id: 1, label: "Build Muscle", icon: <Dumbbell size={20} /> },
    { id: 2, label: "Lose Weight", icon: <Flame size={20} /> },
    { id: 3, label: "Increase Stamina", icon: <HeartPulse size={20} /> },
    { id: 4, label: "Maintain Fitness", icon: <Activity size={20} /> },
    { id: 5, label: "Improve Flexibility", icon: <StretchHorizontal size={20} /> }
  ];

  const handleGoalSet = (id) => {
    setGoal(prev => (prev === id ? null : id));
  };

  const handleSubmit = () => {
    if (!selectedGoal) {
      alert("⚠️ Please select a goal first!");
      return;
    }

    const durationInt = parseInt(duration);
    if (!duration.trim() || isNaN(durationInt) || durationInt < 1 || durationInt > 4) {
      alert("⚠️ Please enter a valid plan duration between 1 to 4 weeks!");
      return;
    }

    if (!prompt.trim()) {
      alert("⚠️ Please enter a prompt!");
      return;
    }

    const selectedGoalLabel = goalList.find(g => g.id === selectedGoal)?.label;

    console.log("📦 Generating Program:", {
      goal: selectedGoalLabel,
      duration: durationInt,
      prompt
    });

    // 🔁 Place API/Gemini call here
  };

  return (
    <div className="generateProgram">
      <div className="heading">
        <h1 className="headingIntro">Smart Fitness Program Generator</h1>
        <p className="headingText">
          Tell us your goal and let our AI create a custom plan for you
        </p>
      </div>

      <div className="goalSelection">
        <div className="goalHeading">
          <h2>Select Goal</h2>
        </div>
        <div className="goalButtons">
          {goalList.map((goal) => (
            <button
              key={goal.id}
              className={`goal ${selectedGoal === goal.id ? 'active' : ''}`}
              onClick={() => handleGoalSet(goal.id)}
            >
              {goal.icon}
              {goal.label}
            </button>
          ))}
        </div>
      </div>

      <div className="promptArea">
        <input
          type="number"
          min="1"
          max="4"
          className="durationInput"
          placeholder="Plan duration in weeks (1–4)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <textarea
          name="promptArea"
          id="promptInput"
          placeholder="e.g. Generate my daily meal routine for weight loss"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button className="generateBtn" onClick={handleSubmit}>
          <Settings size={18} />
          <span>Generate Program</span>
        </button>
      </div>
    </div>
  );
}

export default GenerateProgram;
