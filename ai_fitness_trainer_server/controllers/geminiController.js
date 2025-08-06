// controllers/geminiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎯 Generate Fitness Plan
export const generateFitnessPlan = async (req, res) => {
  try {
    const { userInfo, goal, duration, customPrompt } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅ Template Prompt (clean & structured)
    const prompt = `
You are a certified fitness trainer AI assistant. Your task is to create a personalized, safe, and structured day-wise fitness plan for the user. Follow the format strictly for UI scalability.

👤 User Profile:
- Age: ${userInfo.age}
- Gender: ${userInfo.gender}
- Height: ${userInfo.height} cm
- Weight: ${userInfo.weight} kg
- Activity Level: ${userInfo.activity}
- Occupation: ${userInfo.occupation}
- Smoking: ${userInfo.smoking}
- Alcohol: ${userInfo.alcohol}
- Water Intake: ${userInfo.water_intake} L/day
- Medical Conditions: ${userInfo.medical || "None"}
- Allergies: ${userInfo.allergies || "None"}
- Injuries: ${userInfo.injuries || "None"}
- Sleep: ${userInfo.sleep} hours/night
- Diet Type: ${userInfo.diet}
- Meal Frequency: ${userInfo.meal_frequency} meals/day
- Preferred Workout Time: ${userInfo.workout_time}

🎯 Goal: ${goal}
📆 Duration: ${duration} days
📝 Extra user request: ${customPrompt || "None"}

📦 Output Format:
Respond strictly in the following consistent format:
Day 1:
- Warm-up:
- Workout:
- Meals:
- Hydration Tip:

Day 2:
- Warm-up:
- Workout:
- Meals:
- Hydration Tip:

... (Continue until Day ${duration})

❗ Important:
- Personalize the plan as per user's data.
- Avoid exercises/diets that conflict with medical issues, injuries, or allergies.
- Keep tone professional.
- Do NOT add extra headers or summaries — only follow the day-wise structure above.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ plan: text });
  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    res.status(500).json({ error: "Failed to generate fitness plan." });
  }
};
