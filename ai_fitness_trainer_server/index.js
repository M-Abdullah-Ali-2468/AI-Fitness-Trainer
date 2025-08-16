import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "./supabase/functions/user_functions.js";
import { insertFormData } from "./supabase/functions/onboarding_functions.js";

// ✅ NEW: Import onboarding route
import onboardingRoutes from "./routes/onboardingRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";

import generatedPlansRoutes from './routes/user_plans_routes.js';

import generatedPlansRoute from './routes/active_inactive_routes.js';

import plansRoutes from "./routes/plans_api_routes.js";



// 🔐 Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ 1. Clerk webhook route — must come BEFORE express.json()
app.post("/api/clerk-webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing Clerk webhook secret in .env");
    return res.status(500).send("Webhook secret missing");
  }

  const svix = new Webhook(WEBHOOK_SECRET);

  const payload = req.body;
  const headers = req.headers;

  let evt;
  try {
    evt = svix.verify(payload, headers);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const { type, data } = evt;

  console.log(`📩 Webhook Event Type: ${type}`);

  switch (type) {
    case "user.created":
      console.log("✅ Clerk user.created event received:", {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address,
      });

      try {
        await createUser(
          data.id,
          `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          data.email_addresses?.[0]?.email_address
        );
      } catch (err) {
        console.error("❌ Failed to create user in Supabase:", err.message);
      }
      break;

    case "user.updated":
      console.log("🔄 Clerk user.updated event received:", {
        id: data.id,
        updated_at: data.updated_at,
      });

      try {
        const updatedFields = {
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          email: data.email_addresses?.[0]?.email_address,
        };
        await updateUser(data.id, updatedFields);
      } catch (err) {
        console.error("❌ Failed to update user in Supabase:", err.message);
      }
      break;

    case "user.deleted":
      console.log("🗑️ Clerk user.deleted event received:", {
        id: data.id,
      });

      try {
        await deleteUser(data.id);
      } catch (err) {
        console.error("❌ Failed to delete user in Supabase:", err.message);
      }
      break;

    default:
      console.warn("⚠️ Unhandled webhook type:", type);
      break;
  }

  res.status(200).json({ received: true });
});

// ✅ 2. General middleware
app.use(express.json());
app.use(cors());

// ✅ 3. Route to handle onboarding form submission
app.post("/api/form/onboarding", async (req, res) => {
  try {
    const formData = req.body;
    await insertFormData(formData);
    res.status(200).json({ success: true, message: "Form data inserted successfully" });
  } catch (error) {
    console.error("❌ Error inserting form data:", error.message);
    res.status(500).json({ success: false, message: "Failed to insert form data" });
  }
});

// ✅ 4. Use onboarding GET route
app.use("/api/onboarding", onboardingRoutes);

// ✅ 5. Use gemini plan generate post route
app.use("/api/generate-plan", geminiRoutes);


app.use('/api/plans', generatedPlansRoutes);

app.use('/api/plans', generatedPlansRoute);

app.use("/api/plans", plansRoutes);

// ✅ 6. Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
