import express from "express";
import { fetchUserPlansController } from "../controllers/active_inactive_controller.js";

const router = express.Router();

console.log("🛣️ User plans routes loaded");

// GET all plans of a user by userId (UUID)
router.get("/user/:userId", fetchUserPlansController);

export default router;
