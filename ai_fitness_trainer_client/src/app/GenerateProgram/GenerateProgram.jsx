import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useGeneratePlan } from '../../hooks/useGenerateProgram.js';
import { saveGeneratedPlan } from '../../api/get_user_plan.js';  // API import

import {
  Dumbbell,
  Flame,
  HeartPulse,
  Activity,
  StretchHorizontal,
  Settings
} from "lucide-react";

import botImg from  '../../assets/botImg.png'
import './GenerateProgram.css';

import useData from '../../hooks/useData.js';

function GenerateProgram() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { data, loading, error } = useData(user?.id);
  const [selectedGoal, setGoal] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("");
  const [botMessage, setBotMessage] = useState("");

  // ✅ use custom hook to generate AI plan
  const { plan, p_loading, p_error, generate } = useGeneratePlan();

  // 🔍 Debug incoming user data
  useEffect(() => {
    if (error) {
      console.log('❌ Data fetch error: ' + error);
    } else {
      console.log("✅ Printing user data:", data);
    }
  }, [data, error]);

  // 🔁 Watch generated plan and save it
  useEffect(() => {
    if (plan) {
      console.log("✅ AI Plan Generated:", plan);

      const selectedGoalLabel = goalList.find(g => g.id === selectedGoal)?.label || 'Custom';

      // Prepare data for saving to DB
      const planToSave = {
        user_id: data.user_id,
        title: `${selectedGoalLabel} Plan`,
        days: parseInt(duration) * 7,   // ✅ FIXED: save days not weeks
        notes: prompt,
        content: plan,  // assume plan is JSON object or JSON-stringifiable
        is_active: false,
      };

      saveGeneratedPlan(planToSave)
        .then(saved => {
          console.log('✅ Plan saved successfully:', saved);
          navigate('/profile');
        })
        .catch(err => {
          alert('Failed to save the generated plan, try again later.');
          console.error(err);
        });
    }
  }, [plan, user, duration, prompt, navigate, selectedGoal]);

  const goalList = [
    { id: 1, label: "Build Muscle", icon: <Dumbbell size={20} /> },
    { id: 2, label: "Lose Weight", icon: <Flame size={20} /> },
    { id: 3, label: "Increase Stamina", icon: <HeartPulse size={20} /> },
    { id: 4, label: "Maintain Fitness", icon: <Activity size={20} /> },
    { id: 5, label: "Improve Flexibility", icon: <StretchHorizontal size={20} /> }
  ];

  const messages = [
    "Analyzing your fitness profile...",
    "Creating your personalized workout...",
    "Optimizing your health routine...",
    "Letting the AI cook your perfect plan..."
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
      duration: durationInt*7,
      prompt
    });

    setBotMessage(messages[Math.floor(Math.random()*messages.length)]);

    // ✅ Generate AI Plan
    generate({
      userInfo: data,
      goal: selectedGoalLabel,
      duration: durationInt*7,
      customPrompt: prompt,
    });
  };

  if (p_loading) {
    return (
      <div className="loadingAnimation">
        <div className="img">
          <img src={botImg} alt="Bot" className="Bot" />
        </div>
        <div className="message">
          <p>{botMessage}</p>
        </div>
      </div>
    );
  }

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
