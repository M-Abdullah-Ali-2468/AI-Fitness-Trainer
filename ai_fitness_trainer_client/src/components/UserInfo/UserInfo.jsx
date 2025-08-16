import React, { useState } from "react";
import "./UserInfo.css";
import  {updateUserOnboardingData} from '../../api/fetch_user_data.js'
import {
  UserCircle,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Briefcase,
  Cigarette,
  Wine,
  Droplets,
  Stethoscope,
  AlertTriangle,
  Shield,
  Bed,
  Utensils,
  Clock,
  PencilLine,
  Save,
  X,
  CloudOff,
} from "lucide-react";

const options = {
  gender: ["Male", "Female", "Other"],
  activity: ["sedentary", "light", "moderate", "active", "very-active"],
  smoking: ["never", "occasionally", "regularly"],
  alcohol: ["never", "occasionally", "regularly"],
  diet: [
    "omnivore",
    "vegetarian",
    "vegan",
    "keto",
    "paleo",
    "mediterranean",
  ],
  workout_time: ["morning", "midday", "afternoon", "evening", "night"],
};

export default function UserInfo({ userName, userMail, userInfo }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(userInfo || {});
  
  console.log("This is fucking user info id"+userInfo.id)
  if (!userInfo) return null;

  const infoItems = [
    { key: "age", icon: <Calendar size={18} />, label: "Age", type: "number" },
    {
      key: "gender",
      icon: <UserCircle size={18} />,
      label: "Gender",
      type: "select",
      options: options.gender,
    },
    {
      key: "height",
      icon: <Ruler size={18} />,
      label: "Height (cm)",
      type: "number",
    },
    {
      key: "weight",
      icon: <Weight size={18} />,
      label: "Weight (kg)",
      type: "number",
    },
    {
      key: "activity",
      icon: <Activity size={18} />,
      label: "Activity Level",
      type: "select",
      options: options.activity,
    },
    {
      key: "occupation",
      icon: <Briefcase size={18} />,
      label: "Occupation",
      type: "text",
    },
    {
      key: "smoking",
      icon: <Cigarette size={18} />,
      label: "Smoking",
      type: "select",
      options: options.smoking,
    },
    {
      key: "alcohol",
      icon: <Wine size={18} />,
      label: "Alcohol",
      type: "select",
      options: options.alcohol,
    },
    {
      key: "water_intake",
      icon: <Droplets size={18} />,
      label: "Water Intake (L)",
      type: "number",
    },
    {
      key: "medical",
      icon: <Stethoscope size={18} />,
      label: "Medical Conditions",
      type: "text",
    },
    {
      key: "allergies",
      icon: <AlertTriangle size={18} />,
      label: "Allergies",
      type: "text",
    },
    {
      key: "injuries",
      icon: <Shield size={18} />,
      label: "Injuries",
      type: "text",
    },
    { key: "sleep", icon: <Bed size={18} />, label: "Sleep", type: "text" },
    {
      key: "diet",
      icon: <Utensils size={18} />,
      label: "Diet",
      type: "select",
      options: options.diet,
    },
    {
      key: "meal_frequency",
      icon: <Utensils size={18} />,
      label: "Meal Frequency",
      type: "text",
    },
    {
      key: "workout_time",
      icon: <Clock size={18} />,
      label: "Workout Time",
      type: "select",
      options: options.workout_time,
    },
  ];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

const handleSave = async () => {
  console.log("Saving updated profile:", formData);

  if (!formData.id) {
    alert("Onboarding record ID missing. Please try again.");
    return;
  }

  try {
    const result = await updateUserOnboardingData(formData);

    if (result.success) {
      console.log("✅ Onboarding data updated successfully:", result.data);
      setEditMode(false);
    } else {
      console.error("❌ Error updating onboarding data:", result.error);
      alert(result.error || "Update failed");
    }
  } catch (err) {
    console.error("❌ Unexpected error updating onboarding data:", err);
    alert("Unexpected error occurred");
  }
};



  return (
    <div className="user-info-v2-card">
      <div className="user-info-v2-intro">
        <h1 className="user-info-v2-name">Welcome, {userName} !</h1>
        <p className="user-info-v2-mail">{userMail}</p>
      </div>

      <div className="user-info-v2-table-container">
        <div className="user-info-v2-table-header">
          <h2>User Information</h2>
          {editMode ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="user-info-v2-save-btn"
                onClick={handleSave}
                title="Save"
              >
                <Save size={16} /> Save
              </button>
              <button
                className="user-info-v2-cancel-btn"
                onClick={() => setEditMode(false)}
                title="Cancel"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          ) : (
            <button
              className="user-info-v2-edit-btn"
              onClick={() => setEditMode(true)}
              title="Edit"
            >
              <PencilLine size={16} /> Edit
            </button>
          )}
        </div>

        <div className="user-info-v2-table">
          {infoItems.map(({ key, icon, label, type, options }) => (
            <div className="user-info-v2-row" key={key}>
              <div className="user-info-v2-icon">{icon}</div>
              <div className="user-info-v2-label">{label}</div>
              <div className="user-info-v2-value">
                {editMode ? (
                  type === "select" ? (
                    <select
                      value={formData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                    >
                      
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={formData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  )
                ) : (
                  formData[key] || "Not specified"
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
