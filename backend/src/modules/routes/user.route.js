import express from "express";
import userController from "../controllers/user.controller.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";
// PERBAIKAN: Tambahkan kurung kurawal {} pada import authMiddleware
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();
router.get("/users/me", authMiddleware, userController.getCurrentUser);
router.put("/users/me", authMiddleware, userController.updateProfile);


router.get("/admin/users", adminMiddleware, userController.getAllUsersAdmin);
router.get(
  "/admin/users/:id",
  adminMiddleware,
  userController.getUserByIdAdmin,
);
router.put("/admin/users/:id", adminMiddleware, userController.updateUserAdmin);
router.delete(
  "/admin/users/:id",
  adminMiddleware,
  userController.deleteUserAdmin,
);

export default router;
