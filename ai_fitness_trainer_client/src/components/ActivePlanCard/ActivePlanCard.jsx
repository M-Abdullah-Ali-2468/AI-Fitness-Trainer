import React, { useState } from "react";
import { setInactivePlan } from "../../api/plans_api"; // ✅ api import
import './ActivePlanCard.css'

/**
 * activePlanData: 
 * {
 *   id, user_id, title, days, notes, content (json), is_active, created_at
 * }
 */
function ActivePlanCard({ activePlanData }) {
  const [isViewing, setViewing] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!activePlanData) {
    return (
      <div className="apc-section">
        <div className="apc-intro">
          <h1 className="apc-heading">Active Plans</h1>
          <p className="apc-info">No Active Plans Yet!</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(activePlanData.created_at).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  // ===== Parsing Plan Content =====
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
    if (!content) return <p className="apc-emptySection">No content available</p>;
    const lines = content.split('\n').filter(line => line.trim());

    return (
      <div className={`apc-${sectionType}Content`}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (sectionType === 'meals' && /^-?\s*(Breakfast|Lunch|Dinner|Post-workout|Snack):/i.test(trimmed)) {
            const colonIndex = trimmed.indexOf(':');
            const mealType = trimmed.substring(0, colonIndex).replace(/^-?\s*/, '');
            const description = trimmed.substring(colonIndex + 1).trim();
            return (
              <div key={idx} className="apc-mealItem">
                <h4 className="apc-mealType">{mealType}:</h4>
                <p className="apc-mealDescription">{description}</p>
              </div>
            );
          }
          if (/^\d+\./.test(trimmed)) {
            return <p key={idx} className="apc-exerciseItem">{trimmed}</p>;
          }
          if (trimmed.startsWith('-')) {
            return <p key={idx} className="apc-bulletPoint">{trimmed.slice(1).trim()}</p>;
          }
          return <p key={idx} className="apc-contentLine">{trimmed}</p>;
        })}
      </div>
    );
  }

  const days = parsePlanContent(activePlanData.content);

  // ===== Deactivate API call =====
  async function handleDeleteConfirm() {
    try {
      const res = await setInactivePlan(activePlanData.id);
      console.log("Plan deactivated:", res);
      window.location.reload(); // ✅ refresh page after deactivation
    } catch (error) {
      console.error("Failed to deactivate plan:", error);
      alert("Error deactivating plan!");
    } finally {
      setShowDeleteConfirm(false);
    }
  }

  const goToPrevDay = () => {
    if (activeDayIndex > 0) setActiveDayIndex(activeDayIndex - 1);
  };
  const goToNextDay = () => {
    if (activeDayIndex < days.length - 1) setActiveDayIndex(activeDayIndex + 1);
  };

  return (
    <div className="apc-section" role="region" aria-label="Active Plan">
      <div className="apc-intro">
        <h1 className="apc-heading">{activePlanData.title}</h1>
        <p className="apc-creationTime">Created on: {formattedDate}</p>
      </div>

      {!isViewing && (
        <div className="apc-plansData">
          <button className="apc-viewBtn" onClick={() => setViewing(true)}>
            View Plan
          </button>
          <button className="apc-deleteBtn" onClick={() => setShowDeleteConfirm(true)}>
            Delete Plan
          </button>
        </div>
      )}

      {isViewing && (
        <div className="apc-plansData">
          {days.length > 1 && (
            <nav className="apc-dayNav">
              {days.map((day, idx) => (
                <button
                  key={day.dayNumber}
                  className={`apc-dayTab ${activeDayIndex === idx ? "active" : ""}`}
                  onClick={() => setActiveDayIndex(idx)}
                >
                  Day {day.dayNumber}
                </button>
              ))}
            </nav>
          )}

          {days.length > 1 && (
            <div className="apc-dayControls">
              <button disabled={activeDayIndex === 0} onClick={goToPrevDay} className="apc-prevBtn">◀ Prev</button>
              <span className="apc-dayIndicator">Day {days[activeDayIndex].dayNumber} of {days.length}</span>
              <button disabled={activeDayIndex === days.length - 1} onClick={goToNextDay} className="apc-nextBtn">Next ▶</button>
            </div>
          )}

          <section className="apc-dayContent">
            <h2 className="apc-dayTitle">Day {days[activeDayIndex].dayNumber}</h2>

            {days[activeDayIndex].content.warmup && (
              <div className="apc-planSection apc-warmupSection">
                <h3>🏃‍♂️ Warm-up</h3>
                {formatSectionContent(days[activeDayIndex].content.warmup, "warmup")}
              </div>
            )}

            {days[activeDayIndex].content.workout && (
              <div className="apc-planSection apc-workoutSection">
                <h3>💪 Workout</h3>
                {formatSectionContent(days[activeDayIndex].content.workout, "workout")}
              </div>
            )}

            {days[activeDayIndex].content.meals && (
              <div className="apc-planSection apc-mealsSection">
                <h3>🍽️ Meals</h3>
                {formatSectionContent(days[activeDayIndex].content.meals, "meals")}
              </div>
            )}

            {days[activeDayIndex].content.hydrationTip && (
              <div className="apc-planSection apc-hydrationSection">
                <h3>💧 Hydration Tip</h3>
                {formatSectionContent(days[activeDayIndex].content.hydrationTip, "hydration")}
              </div>
            )}
          </section>

          <div className="apc-planActions">
            <button className="apc-hideBtn" onClick={() => setViewing(false)}>Hide Plan</button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="apc-modalOverlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="apc-modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Deactivate</h2>
            <p>This will deactivate your active plan.</p>
            <button onClick={handleDeleteConfirm} className="apc-confirmBtn">Yes, Deactivate</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="apc-cancelBtn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivePlanCard;
