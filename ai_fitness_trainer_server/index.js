import express from "express";
import bodyParser from "body-parser";
import { Webhook } from "svix";
import dotenv from "dotenv";
import { createUser, updateUser, deleteUser } from "./supabase/functions/user_functions.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Clerk webhook secret
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error("❌ Missing Clerk webhook secret in environment variables.");
  process.exit(1); // Stop the server if secret is missing
}

// Required middleware to parse raw body for Clerk's Svix
app.use("/api/clerk-webhook", bodyParser.raw({ type: "application/json" }));

app.post("/api/clerk-webhook", async (req, res) => {
  const svix = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = svix.verify(req.body, req.headers);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const { type, data } = evt;

  try {
    if (type === "user.created") {
      const { id, first_name, last_name, email_addresses } = data;
      const fullName = `${first_name} ${last_name}`;
      const email = email_addresses[0]?.email_address;
      await createUser(id, fullName, email);
    } else if (type === "user.updated") {
      const { id, first_name, last_name, email_addresses } = data;
      const updatedFields = {
        name: `${first_name} ${last_name}`,
        email: email_addresses[0]?.email_address,
      };
      await updateUser(id, updatedFields);
    } else if (type === "user.deleted") {
      await deleteUser(data.id);
    } else {
      console.log("ℹ️ Unhandled event type:", type);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error handling event:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Clerk webhook listener running at http://localhost:${port}`);
});
