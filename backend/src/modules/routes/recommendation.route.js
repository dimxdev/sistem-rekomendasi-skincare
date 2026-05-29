import express from "express";
import recommendationController from "../controllers/recommendation.controller.js";

const router = express.Router();

router.post("/", recommendationController.getRecommendations);

export default router;
