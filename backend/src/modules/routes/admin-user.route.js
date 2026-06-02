import express from "express";
import adminUserController from "../controllers/admin-user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Admin Protected routes: GET all users, GET by ID, POST, PUT, DELETE
router.get(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  adminUserController.getUsers
);

router.get(
  "/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  adminUserController.getUserById
);

router.post(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  adminUserController.createUser
);

router.put(
  "/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  adminUserController.updateUser
);

router.delete(
  "/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  adminUserController.deleteUser
);

export default router;
