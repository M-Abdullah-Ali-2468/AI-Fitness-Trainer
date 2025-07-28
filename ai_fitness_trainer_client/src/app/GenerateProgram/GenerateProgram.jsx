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

  const goalList = [
    { id: 1, label: "Build Muscle", icon: <Dumbbell size={20} /> },
    { id: 2, label: "Lose Weight", icon: <Flame size={20} /> },
    { id: 3, label: "Increase Stamina", icon: <HeartPulse size={20} /> },
    { id: 4, label: "Maintain Fitness", icon: <Activity size={20} /> },
    { id: 5, label: "Improve Flexibility", icon: <StretchHorizontal size={20} /> }
  ];

  const handleGoalSet = (id) => {
    if (selectedGoal === id) {
      setGoal(null);
    } else {
      setGoal(id);
    }
  };

  const handleSubmit = () => {
    if (!selectedGoal) {
      alert("⚠️ Please select a goal first!");
      return;
    }
    if (!prompt.trim()) {
      alert("⚠️ Please enter a prompt!");
      return;
    }

    // 🧠 Replace this with your AI call logic
    console.log("Generating Program for:", {
      goal: goalList.find(g => g.id === selectedGoal).label,
      prompt
    });
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
  className={`goal ${selectedGoal === goal.id ? 'active' : ''}`}
  id={goal.id}
  onClick={() => handleGoalSet(goal.id)}
>
  {goal.icon}
  {goal.label}
</button>
        ))}
       </div>
      </div>

      <div className="promptArea">
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
