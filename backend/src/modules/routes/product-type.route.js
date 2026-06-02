import express from "express";
import productTypeController from "../controllers/product-type.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Public route (semua user bisa melihat tipe produk)
router.get("/product-types", productTypeController.getProductTypes);

// Admin Protected routes (hanya admin yang bisa membuat, mengedit, dan menghapus)
router.post(
  "/admin/product-types",
  authMiddleware,
  adminMiddleware,
  productTypeController.createProductType,
);
router.put(
  "/admin/product-types/:id",
  authMiddleware,
  adminMiddleware,
  productTypeController.updateProductType,
);
router.delete(
  "/admin/product-types/:id",
  authMiddleware,
  adminMiddleware,
  productTypeController.deleteProductType,
);

export default router;
