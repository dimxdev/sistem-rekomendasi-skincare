import express from "express";
import masterDataController from "../controllers/master-data.controller.js";

const router = express.Router();

router.get("/countries", masterDataController.getCountries);
router.get("/product-types", masterDataController.getProductTypes);
router.get("/skin-types", masterDataController.getSkinTypes);
router.get("/concerns", masterDataController.getConcerns);

export default router;
