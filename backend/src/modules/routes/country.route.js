import express from "express";
import countryController from "../controllers/country.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Public route: GET /countries
router.get("/countries", countryController.getCountries);

// Admin Protected routes: POST, PUT, DELETE
router.post(
  "/admin/countries",
  authMiddleware,
  adminMiddleware,
  countryController.createCountry
);
router.put(
  "/admin/countries/:id",
  authMiddleware,
  adminMiddleware,
  countryController.updateCountry
);
router.delete(
  "/admin/countries/:id",
  authMiddleware,
  adminMiddleware,
  countryController.deleteCountry
);

export default router;
