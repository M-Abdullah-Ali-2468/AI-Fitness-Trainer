import React, { useState } from "react";
import botImg from '../../assets/botImg.png';
import './MultistepFrom.css';

const steps = ["Basic Info", "Physical Stats", "Goals", "Health", "Lifestyle"];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activity: "",
    medical: "",
    allergies: "",
    sleep: "",
    diet: "",
    workoutTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const next = () => {
    if (isStepValid()) setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prev = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.age !== "" && formData.gender !== "";
      case 2:
        return formData.height !== "" && formData.weight !== "";
      case 3:
        return formData.goal !== "" && formData.activity !== "";
      default:
        return true; // Steps 4 & 5 are optional
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <label>Age</label>
            <input type="number" name="age" placeholder="Age" onChange={handleChange} value={formData.age} />
            <label>Gender</label>
            <select name="gender" onChange={handleChange} value={formData.gender}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            <label>Height (cm)</label>
            <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} value={formData.height} />
            <label>Weight (kg)</label>
            <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} value={formData.weight} />
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            <label>Goal</label>
            <select name="goal" onChange={handleChange} value={formData.goal}>
              <option value="">Select Goal</option>
              <option value="Lose Weight">Lose Weight</option>
              <option value="Build Muscle">Build Muscle</option>
              <option value="Stay Fit">Stay Fit</option>
            </select>
            <label>Activity Level</label>
            <select name="activity" onChange={handleChange} value={formData.activity}>
              <option value="">Activity Level</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div className="form-step">
            <label>Medical Conditions (Optional)</label>
            <input type="text" name="medical" placeholder="Medical Conditions (if any)" onChange={handleChange} value={formData.medical} />
            <label>Allergies (Optional)</label>
            <input type="text" name="allergies" placeholder="Allergies" onChange={handleChange} value={formData.allergies} />
          </div>
        );
      case 5:
        return (
          <div className="form-step">
            <label>Average Sleep Hours (Optional)</label>
            <input type="text" name="sleep" placeholder="Sleep Hours" onChange={handleChange} value={formData.sleep} />
            <label>Diet Preference (Optional)</label>
            <input type="text" name="diet" placeholder="Diet (Veg/Non-Veg)" onChange={handleChange} value={formData.diet} />
            <label>Preferred Workout Time (Optional)</label>
            <input type="text" name="workoutTime" placeholder="Workout Time" onChange={handleChange} value={formData.workoutTime} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="interactive-container">
      {/* Chat Section */}
      <div className="chat-section">
        <div className="bot-message">
          <img src={botImg} alt="Bot" className="bot-img" />
          <div className="message-box">
            {step === 1 && `Hi ! Let's get started with your basic info.`}
            {step === 2 && "Great! Now enter your physical stats."}
            {step === 3 && "Awesome! What are your fitness goals?"}
            {step === 4 && "Do you have any health conditions or allergies?"}
            {step === 5 && "Almost there! Tell me about your lifestyle."}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="progress-bar">
          {steps.map((_, index) => (
            <React.Fragment key={index}>
              <div className={`progress-step ${index + 1 <= step ? "active" : ""}`}>{index + 1}</div>
              {index !== steps.length - 1 && (
                <div className={`progress-line ${index + 1 < step ? "filled" : ""}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <h2>{steps[step - 1]}</h2>
        {renderStep()}

        <div className="button-group">
          {step > 1 && <button onClick={prev}>Back</button>}
          {step < steps.length ? (
            <button onClick={next} disabled={!isStepValid()}>Next</button>
          ) : (
            <button onClick={() => alert("Form submitted!")}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}
