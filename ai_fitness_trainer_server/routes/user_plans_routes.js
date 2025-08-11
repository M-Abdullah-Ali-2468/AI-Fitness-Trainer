import express from 'express';
import { savePlanController } from '../controllers/generated_plans_controller.js';

const router = express.Router();

console.log("🛣️ Generated Plans routes loaded");

// POST /api/plans/save
router.post('/save', savePlanController);

export default router;
