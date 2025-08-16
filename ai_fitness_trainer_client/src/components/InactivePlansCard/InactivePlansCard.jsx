import React, { useState } from "react";
import "./InactivePlansCard.css";
import { deletePlan, setActivePlan, setInactivePlan } from "../../api/plans_api.js";

function InactivePlansCard({
  inactivePlansData,
  openPlanId,
  setOpenPlanId,
  deletePlanId,
  setDeletePlanId,
  activePlanId,      // ✅ Active plan id from Profile
  onPlanChange       // ✅ Callback to refresh Profile
}) {
  if (!inactivePlansData) return null;

  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const formattedDate = new Date(inactivePlansData.created_at).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  // ====== Parsing Logic ======
  function parsePlanContent(content) {
    let contentText;
    try {
      if (typeof content === "string") {
        try {
          const parsed = JSON.parse(content);
          contentText = typeof parsed === "object" && parsed.plan ? parsed.plan : parsed;
        } catch {
          contentText = content;
        }
      } else if (typeof content === "object") {
        contentText = content.plan || content;
      } else {
        contentText = String(content);
      }
    } catch (error) {
      console.error("Error parsing content:", error);
      contentText = String(content || "");
    }

    const days = [];
    const dayPatterns = [
      /Day (\d+):/gi,
      /Day (\d+) -/gi,
      /Day (\d+)\s*(?=\s*-)/gi,
      /Day (\d+)/gi
    ];

    let matches = [];
    for (const pattern of dayPatterns) {
      matches = [...contentText.matchAll(pattern)];
      if (matches.length > 0) break;
    }

    if (matches.length === 0) {
      days.push({ 
        dayNumber: 1, 
        content: parseDayContent(contentText),
        rawContent: contentText
      });
      return days;
    }

    for (let i = 0; i < matches.length; i++) {
      const dayNumber = parseInt(matches[i][1]);
      const dayStart = matches[i].index;
      const dayEnd = matches[i + 1] ? matches[i + 1].index : contentText.length;
      const dayContent = contentText.slice(dayStart, dayEnd);
      days.push({ 
        dayNumber, 
        content: parseDayContent(dayContent),
        rawContent: dayContent
      });
    }

    return days;
  }

  function parseDayContent(dayText) {
    const sections = {
      warmup: "",
      workout: "",
      meals: "",
      hydrationTip: "",
    };

    const patterns = {
      warmup: [
        /- Warm-up:(.*?)(?=- Workout:|- Meals:|- Hydration Tip:|Day \d+:|$)/s,
        /Warm-up:(.*?)(?=Workout:|Meals:|Hydration Tip:|Day \d+:|$)/s,
        /🏃‍♂️ Warm-up:(.*?)(?=💪 Workout:|🍽️ Meals:|💧 Hydration|Day \d+:|$)/s
      ],
      workout: [
        /- Workout:(.*?)(?=- Meals:|- Hydration Tip:|Day \d+:|$)/s,
        /Workout:(.*?)(?=Meals:|Hydration Tip:|Day \d+:|$)/s,
        /💪 Workout:(.*?)(?=🍽️ Meals:|💧 Hydration|Day \d+:|$)/s
      ],
      meals: [
        /- Meals:(.*?)(?=- Hydration Tip:|Day \d+:|$)/s,
        /Meals:(.*?)(?=Hydration Tip:|Day \d+:|$)/s,
        /🍽️ Meals:(.*?)(?=💧 Hydration|Day \d+:|$)/s
      ],
      hydrationTip: [
        /- Hydration Tip:(.*)$/s,
        /Hydration Tip:(.*)$/s,
        /💧 Hydration Tip:(.*)$/s
      ]
    };

    Object.keys(patterns).forEach(sectionKey => {
      for (const pattern of patterns[sectionKey]) {
        const match = dayText.match(pattern);
        if (match && match[1]) {
          sections[sectionKey] = match[1].trim();
          break;
        }
      }
    });

    return sections;
  }

  function formatSectionContent(content, sectionType) {
    if (!content) return <p className="ipc-emptySection">No content available</p>;
    const lines = content.split('\n').filter(line => line.trim());

    return (
      <div className={`ipc-${sectionType}Content`}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (sectionType === 'meals' && /^-?\s*(Breakfast|Lunch|Dinner|Post-workout|Snack):/i.test(trimmed)) {
            const colonIndex = trimmed.indexOf(':');
            const mealType = trimmed.substring(0, colonIndex).replace(/^-?\s*/, '');
            const description = trimmed.substring(colonIndex + 1).trim();
            return (
              <div key={idx} className="ipc-mealItem">
                <h4 className="ipc-mealType">{mealType}:</h4>
                <p className="ipc-mealDescription">{description}</p>
              </div>
            );
          }
          if (/^\d+\./.test(trimmed)) {
            return <p key={idx} className="ipc-exerciseItem">{trimmed}</p>;
          }
          if (trimmed.startsWith('-')) {
            return <p key={idx} className="ipc-bulletPoint">{trimmed.slice(1).trim()}</p>;
          }
          return <p key={idx} className="ipc-contentLine">{trimmed}</p>;
        })}
      </div>
    );
  }

  const days = parsePlanContent(inactivePlansData.content);

  // ====== Actions ======
  const handleActivate = async () => {
    try {
      // 1️⃣ Deactivate current active plan if exists
      if (activePlanId) {
        await setInactivePlan(activePlanId);
      }

      // 2️⃣ Activate clicked plan
      await setActivePlan(inactivePlansData.id);

      // 3️⃣ Refresh parent Profile
      if (onPlanChange) onPlanChange();

    } catch (error) {
      console.error("Activate plan error:", error);
      alert("Failed to activate the plan. Try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePlan(inactivePlansData.id);
      setDeletePlanId(null);
      alert(`Plan "${inactivePlansData.title}" deleted successfully!`);

      if (onPlanChange) onPlanChange(); // Refresh after deletion
    } catch (error) {
      console.error("Delete plan error:", error);
      alert("Failed to delete the plan. Try again.");
    }
  };

  return (
    <div className="ipc-card">
      <div className="ipc-header">
        <h2 className="ipc-title">{inactivePlansData.title}</h2>
        <span className="ipc-date">Created on {formattedDate}</span>
      </div>

      <div className="ipc-body">
        <p><strong>Days:</strong> {inactivePlansData.days}</p>
        {inactivePlansData.notes && (
          <p className="ipc-notes">
            <strong>Notes:</strong> {inactivePlansData.notes}
          </p>
        )}
      </div>

      <div className="ipc-actions">
        <button onClick={() => setOpenPlanId(inactivePlansData.id)} className="ipc-viewBtn">
          View
        </button>
        <button onClick={handleActivate} className="ipc-activateBtn">
          Activate
        </button>
        <button onClick={() => setDeletePlanId(inactivePlansData.id)} className="ipc-deleteBtn">
          Delete
        </button>
      </div>

      {/* Modal for viewing plan */}
      {openPlanId === inactivePlansData.id && (
        <div className="ipc-modalOverlay" onClick={() => setOpenPlanId(null)}>
          <div className="ipc-modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>{inactivePlansData.title}</h2>

            {/* Day Tabs */}
            {days.length > 1 && (
              <div className="ipc-dayNav">
                {days.map((day, idx) => (
                  <button
                    key={day.dayNumber}
                    className={`ipc-dayTab ${activeDayIndex === idx ? "active" : ""}`}
                    onClick={() => setActiveDayIndex(idx)}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>
            )}

            {/* Day Content */}
            <section className="ipc-dayContent">
              <h3>Day {days[activeDayIndex].dayNumber}</h3>

              {days[activeDayIndex].content.warmup && (
                <div className="ipc-section">
                  <h4>🏃‍♂️ Warm-up</h4>
                  {formatSectionContent(days[activeDayIndex].content.warmup, "warmup")}
                </div>
              )}

              {days[activeDayIndex].content.workout && (
                <div className="ipc-section">
                  <h4>💪 Workout</h4>
                  {formatSectionContent(days[activeDayIndex].content.workout, "workout")}
                </div>
              )}

              {days[activeDayIndex].content.meals && (
                <div className="ipc-section">
                  <h4>🍽️ Meals</h4>
                  {formatSectionContent(days[activeDayIndex].content.meals, "meals")}
                </div>
              )}

              {days[activeDayIndex].content.hydrationTip && (
                <div className="ipc-section">
                  <h4>💧 Hydration Tip</h4>
                  {formatSectionContent(days[activeDayIndex].content.hydrationTip, "hydration")}
                </div>
              )}
            </section>

            <button onClick={() => setOpenPlanId(null)} className="ipc-closeBtn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for deleting plan */}
      {deletePlanId === inactivePlansData.id && (
        <div className="ipc-modalOverlay" onClick={() => setDeletePlanId(null)}>
          <div className="ipc-modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this plan?</p>
            <button onClick={handleDeleteConfirm} className="ipc-confirmBtn">
              Yes, Delete
            </button>
            <button onClick={() => setDeletePlanId(null)} className="ipc-cancelBtn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InactivePlansCard;
