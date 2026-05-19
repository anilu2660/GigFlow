import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportCSV,
  getDashboardStats,
} from "../controllers/leadController";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createLeadSchema, updateLeadSchema } from "../validations";

const router = express.Router();

router.use(protect); // All lead routes require authentication

router.get("/export/csv", authorizeRoles("admin"), exportCSV);
router.get("/stats/dashboard", getDashboardStats);

router.route("/")
  .get(getLeads)
  .post(validateRequest(createLeadSchema), createLead);

router.route("/:id")
  .get(getLeadById)
  .put(validateRequest(updateLeadSchema), updateLead)
  .delete(deleteLead);

export default router;
