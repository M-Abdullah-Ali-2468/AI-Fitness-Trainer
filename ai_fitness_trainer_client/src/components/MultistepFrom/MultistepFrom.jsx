import React, { useState } from "react";
import botImg from '../../assets/botImg.png';
import './MultistepFrom.css';

const steps = ["Basic Info", "Body Measurements", "Lifestyle & Activity", "Health Conditions", "Recovery & Diet"];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity: "",
    occupation: "",
    smoking: "",
    alcohol: "",
    waterIntake: "",
    medical: "",
    allergies: "",
    injuries: "",
    sleep: "",
    diet: "",
    mealFrequency: "",
    workoutTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const next = () => {
    if (isStepValid()) setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prev = () => setStep((prev) => Math.max(prev - 1, 1));


  const handleSubmit = () => {
    localStorage.setItem("userProfileData", JSON.stringify(formData));
    alert("Form submitted! Data saved locally.");
    console.log("Submitted data:", formData);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.age !== "" && formData.gender !== "";
      case 2:
        return formData.height !== "" && formData.weight !== "";
      case 3:
        return formData.activity !== "" && formData.occupation !== "";
      default:
        return true;
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
            <input type="number" name="height" placeholder="Height in cm" onChange={handleChange} value={formData.height} />
            <label>Weight (kg)</label>
            <input type="number" name="weight" placeholder="Weight in kg" onChange={handleChange} value={formData.weight} />
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            <label>Activity Level</label>
            <select name="activity" onChange={handleChange} value={formData.activity}>
              <option value="">Select Activity Level</option>
              <option value="Sedentary">Sedentary (Little to no exercise)</option>
              <option value="Lightly Active">Lightly Active (1–2 days/week)</option>
              <option value="Moderately Active">Moderately Active (3–5 days/week)</option>
              <option value="Very Active">Very Active (6–7 days/week)</option>
            </select>
            <label>Occupation Type</label>
            <select name="occupation" onChange={handleChange} value={formData.occupation}>
              <option value="">Select Occupation Type</option>
              <option value="Desk Job">Desk Job</option>
              <option value="Field Work">Field Work</option>
              <option value="Manual Labor">Manual Labor</option>
            </select>
            <label>Do you smoke?</label>
            <select name="smoking" onChange={handleChange} value={formData.smoking}>
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
              <option value="Regularly">Regularly</option>
            </select>
            <label>Do you consume alcohol?</label>
            <select name="alcohol" onChange={handleChange} value={formData.alcohol}>
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
              <option value="Regularly">Regularly</option>
            </select>
            <label>Water Intake (liters/day)</label>
            <input type="number" name="waterIntake" placeholder="e.g. 2.5" onChange={handleChange} value={formData.waterIntake} />
          </div>
        );
      case 4:
        return (
          <div className="form-step">
            <label>Medical Conditions (Optional)</label>
            <input type="text" name="medical" placeholder="e.g. Diabetes, Asthma" onChange={handleChange} value={formData.medical} />
            <label>Allergies (Optional)</label>
            <input type="text" name="allergies" placeholder="e.g. Nuts, Pollen" onChange={handleChange} value={formData.allergies} />
            <label>Any Injuries (past or present)</label>
            <input type="text" name="injuries" placeholder="e.g. Knee pain, lower back issue" onChange={handleChange} value={formData.injuries} />
          </div>
        );
      case 5:
        return (
          <div className="form-step">
            <label>Average Sleep Hours</label>
            <input type="text" name="sleep" placeholder="e.g. 7" onChange={handleChange} value={formData.sleep} />
            <label>Diet Preference</label>
            <input type="text" name="diet" placeholder="e.g. Veg / Non-Veg / Keto" onChange={handleChange} value={formData.diet} />
            <label>Meal Frequency (meals/day)</label>
            <input type="text" name="mealFrequency" placeholder="e.g. 3" onChange={handleChange} value={formData.mealFrequency} />
            <label>Preferred Workout Time</label>
            <input type="text" name="workoutTime" placeholder="e.g. Morning / Evening" onChange={handleChange} value={formData.workoutTime} />
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
            {step === 1 && `Welcome. Please enter your basic demographic information.`}
            {step === 2 && "Now provide your physical measurements."}
            {step === 3 && "Let’s understand your lifestyle and daily habits."}
            {step === 4 && "Kindly mention any health concerns or past injuries."}
            {step === 5 && "Lastly, tell us about your recovery and dietary habits."}
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
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}
