import express from "express";
import skinTypeController from "../controllers/skin-type.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Public route: GET /skin-types
router.get("/skin-types", skinTypeController.getSkinTypes);

// Admin Protected routes: POST, PUT, DELETE
router.post(
  "/admin/skin-types",
  authMiddleware,
  adminMiddleware,
  skinTypeController.createSkinType,
);
router.put(
  "/admin/skin-types/:id",
  authMiddleware,
  adminMiddleware,
  skinTypeController.updateSkinType,
);
router.delete(
  "/admin/skin-types/:id",
  authMiddleware,
  adminMiddleware,
  skinTypeController.deleteSkinType,
);

export default router;
