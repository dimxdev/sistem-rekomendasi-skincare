import express from "express";
import favoriteController from "../controllers/favorite.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, favoriteController.addFavorite);
router.delete("/:productId", authMiddleware, favoriteController.removeFavorite);
router.get("/", authMiddleware, favoriteController.getFavorites);

export default router;
