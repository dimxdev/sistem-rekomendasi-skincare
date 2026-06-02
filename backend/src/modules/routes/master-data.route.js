import express from "express";
import masterDataController from "../controllers/master-data.controller.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Public Routes (GET)
router.get("/countries", masterDataController.getCountries);
router.get("/product-types", masterDataController.getProductTypes);
router.get("/skin-types", masterDataController.getSkinTypes);
router.get("/concerns", masterDataController.getConcerns);

// Admin Routes (POST, PUT, DELETE)
router.post(
  "/admin/countries",
  adminMiddleware,
  masterDataController.createCountry,
);
router.put(
  "/admin/countries/:id",
  adminMiddleware,
  masterDataController.updateCountry,
);
router.delete(
  "/admin/countries/:id",
  adminMiddleware,
  masterDataController.deleteCountry,
);

router.post(
  "/admin/product-types",
  adminMiddleware,
  masterDataController.createProductType,
);
router.put(
  "/admin/product-types/:id",
  adminMiddleware,
  masterDataController.updateProductType,
);
router.delete(
  "/admin/product-types/:id",
  adminMiddleware,
  masterDataController.deleteProductType,
);

router.post(
  "/admin/skin-types",
  adminMiddleware,
  masterDataController.createSkinType,
);
router.put(
  "/admin/skin-types/:id",
  adminMiddleware,
  masterDataController.updateSkinType,
);
router.delete(
  "/admin/skin-types/:id",
  adminMiddleware,
  masterDataController.deleteSkinType,
);

router.post(
  "/admin/concerns",
  adminMiddleware,
  masterDataController.createConcern,
);
router.put(
  "/admin/concerns/:id",
  adminMiddleware,
  masterDataController.updateConcern,
);
router.delete(
  "/admin/concerns/:id",
  adminMiddleware,
  masterDataController.deleteConcern,
);

export default router;
