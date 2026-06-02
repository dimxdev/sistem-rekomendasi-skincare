import express from "express";
import productController from "../controllers/product.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.post(
  "/admin",
  authMiddleware,
  adminMiddleware,
  productController.createProduct,
);
router.put(
  "/admin/:productId",
  authMiddleware,
  adminMiddleware,
  productController.updateProduct,
);
router.delete(
  "/admin/:productId",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct,
);
router.get("/:productId", productController.getProductDetail);

export default router;
