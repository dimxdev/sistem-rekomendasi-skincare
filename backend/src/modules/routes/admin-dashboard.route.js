import express from "express";
import adminDashboardController from "../controllers/admin-dashboard.controller.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", adminMiddleware, adminDashboardController.getSummary);

export default router;
