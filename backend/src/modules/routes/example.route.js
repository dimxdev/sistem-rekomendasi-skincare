// File di dalam folder routes fungsinya mengatur rute

import express from "express";
import exampleController from "../controllers/example.controller.js";

const router = express.Router();

router.get("/", exampleController.getAllExamples);
router.get("/:exampleId", exampleController.getExampleById);
router.post("/", exampleController.createExample);
router.put("/:exampleId", exampleController.updateExample);
router.delete("/:exampleId", exampleController.deleteExample);

export default router;