import express from "express";
import skinConcernController from "../controllers/skin-concern.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Public route: GET /concerns
router.get("/concerns", skinConcernController.getSkinConcerns);

// Admin Protected routes: POST, PUT, DELETE
router.post(
  "/admin/concerns",
  authMiddleware,
  adminMiddleware,
  skinConcernController.createSkinConcern,
);
router.put(
  "/admin/concerns/:id",
  authMiddleware,
  adminMiddleware,
  skinConcernController.updateSkinConcern,
);
router.delete(
  "/admin/concerns/:id",
  authMiddleware,
  adminMiddleware,
  skinConcernController.deleteSkinConcern,
);

export default router;
