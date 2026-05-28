import express from "express";
import adminProductController from "../controllers/admin-product.controller.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  adminMiddleware,
  upload.single("image"),
  adminProductController.createProduct,
);
router.put(
  "/:productId",
  adminMiddleware,
  upload.single("image"),
  adminProductController.updateProduct,
);
router.patch(
  "/:productId/status",
  adminMiddleware,
  adminProductController.toggleProductStatus,
);
router.delete(
  "/:productId",
  adminMiddleware,
  adminProductController.deleteProduct,
);

export default router;
