import express from "express";
import {
  activatePlan,
  deactivatePlan,
  deletePlan,
} from "../controllers/plans_api_controller.js";

const router = express.Router();

// ✅ Activate plan
router.put("/:id/activate", activatePlan);

// ✅ Deactivate plan
router.put("/:id/deactivate", deactivatePlan);

// ✅ Delete plan
router.delete("/:id", deletePlan);

export default router;
