// MultiStepForm.jsx

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import botImg from "../../assets/botImg.png";
import { useNavigate } from "react-router-dom";
import { submitOnboardingForm } from "../../api/onboardingApi.js";
import "./MultiStepForm.css";

const steps = [
  "Basic Info",
  "Body Measurements",
  "Lifestyle & Activity",
  "Health Conditions",
  "Recovery & Diet"
];

const stepMessages = {
  1: "👋 Hi there! Let's start with some basic info about you.",
  2: "📏 Great! Now tell me about your height and weight.",
  3: "💼 Time to talk about your lifestyle and daily habits.",
  4: "🩺 Any medical conditions or allergies I should know?",
  5: "🍽️ Finally, let's talk about your diet and recovery routine!"
};

const MultiStepForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [typedMessage, setTypedMessage] = useState("");
  const intervalRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity: "",
    occupation: "",
    smoking: "",
    alcohol: "",
    water_intake: "",
    medical: "",
    allergies: "",
    injuries: "",
    sleep: "",
    diet: "",
    meal_frequency: "",
    workout_time: ""
  });

  useEffect(() => {
    const fullText = stepMessages[step];
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTypedMessage("");

    const startTyping = () => {
      let currentIndex = 0;
      intervalRef.current = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypedMessage(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalRef.current);
        }
      }, 40);
    };

    const timeout = setTimeout(startTyping, 100);
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [step]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    const requiredFieldsPerStep = {
      1: ["age", "gender"],
      2: ["height", "weight"],
      3: ["activity", "occupation", "smoking", "alcohol"],
      4: ["water_intake"],
      5: ["sleep", "diet"]
    };

    const currentFields = requiredFieldsPerStep[step] || [];
    const allFilled = currentFields.every((field) => formData[field]?.toString().trim() !== "");

    if (!allFilled) {
      alert("Please fill all required fields.");
      return;
    }

    if (step < steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const goToStep = (targetStep) => {
    if (targetStep <= step) setStep(targetStep);
  };

  const submitFormData = async () => {
    if (!user?.id) {
      alert("User not authenticated!");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitOnboardingForm(user.id, formData);
      if (result.error) {
        alert("❌ Failed to submit form: " + result.error);
      } else {
        alert("✅ Form submitted successfully!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("❌ An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="progress-container">
      <div className="progress-bar">
        {steps.map((stepName, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < step;
          const isCurrent = stepNumber === step;
          const isClickable = stepNumber <= step;

          return (
            <div key={stepNumber} className="progress-step-wrapper">
              <div
                className={`progress-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isClickable ? "clickable" : ""}`}
                onClick={() => isClickable && goToStep(stepNumber)}
              >
                <div className="step-circle">{isCompleted ? "✓" : stepNumber}</div>
                <span className="step-label">{stepName}</span>
              </div>
              {stepNumber < steps.length && (
                <div className={`progress-line ${isCompleted ? "completed" : ""}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label>Age: <input name="age" value={formData.age} onChange={handleChange} type="number" placeholder="Enter your age" /></label>
            <label>Gender:
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </>
        );
      case 2:
        return (
          <>
            <label>Height: <input name="height" value={formData.height} onChange={handleChange} type="number" placeholder="e.g., 175 cm" /></label>
            <label>Weight: <input name="weight" value={formData.weight} onChange={handleChange} type="number" placeholder="e.g., 70 kg" /></label>
          </>
        );
      case 3:
        return (
          <>
            <label>Activity Level:
              <select name="activity" value={formData.activity} onChange={handleChange}>
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very-active">Very Active</option>
              </select>
            </label>
            <label>Occupation: <input name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Your job title" /></label>
            <label>Smoking:
              <select name="smoking" value={formData.smoking} onChange={handleChange}>
                <option value="">Do you smoke?</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="regularly">Regularly</option>
              </select>
            </label>
            <label>Alcohol:
              <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
                <option value="">Do you drink alcohol?</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="regularly">Regularly</option>
              </select>
            </label>
          </>
        );
      case 4:
        return (
          <>
            <label>Water Intake: <input name="water_intake" value={formData.water_intake} onChange={handleChange} type="number" placeholder="e.g., 8 glasses/day" /></label>
            <label>Medical Conditions (optional): <input name="medical" value={formData.medical} onChange={handleChange} /></label>
            <label>Allergies (optional): <input name="allergies" value={formData.allergies} onChange={handleChange} /></label>
            <label>Injuries (optional): <input name="injuries" value={formData.injuries} onChange={handleChange} /></label>
          </>
        );
      case 5:
        return (
          <>
            <label>Sleep Duration: <input name="sleep" value={formData.sleep} onChange={handleChange} placeholder="e.g., 7 hours" /></label>
            <label>Diet Type:
              <select name="diet" value={formData.diet} onChange={handleChange}>
                <option value="">Select diet type</option>
                <option value="omnivore">Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
            </label>
            <label>Meal Frequency (optional): <input name="meal_frequency" value={formData.meal_frequency} onChange={handleChange} placeholder="e.g., 3 meals/day" /></label>
            <label>Preferred Workout Time (optional):
              <select name="workout_time" value={formData.workout_time} onChange={handleChange}>
                <option value="">When do you prefer to workout?</option>
                <option value="morning">Morning</option>
                <option value="midday">Midday</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="multistep-container">
      <div className="bot-section">
        <div className="bot-img-container">
          <img src={botImg} alt="Bot" />
        </div>
        <div className="chat-message">{typedMessage}</div>
      </div>
      <div className="form-section">
        {renderProgressBar()}
        <h2>{steps[step - 1]}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
          <div className="form-navigation">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="secondary-button">
                Previous
              </button>
            )}
            {step < steps.length && (
              <button type="button" onClick={nextStep} className="primary-button">
                Next
              </button>
            )}
            {step === steps.length && (
              <button type="button" onClick={submitFormData} className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
