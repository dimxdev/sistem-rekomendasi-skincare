import express from "express";
import controller from "../controllers/master-data.controller.js";
// Asumsi path middleware untuk proteksi Admin Route
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

// --- PUBLIC / GET (Read) ---
router.get("/countries", controller.getCountries);
router.get("/product-types", controller.getProductTypes);
router.get("/skin-types", controller.getSkinTypes);
router.get("/concerns", controller.getConcerns);

// --- PROTECTED ADMIN ROUTES (C, U, D) ---
router.post("/admin/countries", adminMiddleware, controller.addCountry);
router.put("/admin/countries/:id", adminMiddleware, controller.editCountry);
router.delete(
  "/admin/countries/:id",
  adminMiddleware,
  controller.removeCountry,
);

router.post("/admin/product-types", adminMiddleware, controller.addProductType);
router.put(
  "/admin/product-types/:id",
  adminMiddleware,
  controller.editProductType,
);
router.delete(
  "/admin/product-types/:id",
  adminMiddleware,
  controller.removeProductType,
);

router.post("/admin/skin-types", adminMiddleware, controller.addSkinType);
router.put("/admin/skin-types/:id", adminMiddleware, controller.editSkinType);
router.delete(
  "/admin/skin-types/:id",
  adminMiddleware,
  controller.removeSkinType,
);

router.post("/admin/concerns", adminMiddleware, controller.addConcern);
router.put("/admin/concerns/:id", adminMiddleware, controller.editConcern);
router.delete("/admin/concerns/:id", adminMiddleware, controller.removeConcern);

export default router;
