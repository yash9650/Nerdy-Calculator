import express from "express";
import { CalculationController } from "../Controllers/calculation.controller";

const router = express.Router();

router.post(
  "/getAllUserCalculations",
  CalculationController.getAllUserCalculations
);
router.post("/createCalculation", CalculationController.createCalculation);

router.delete(
  "/deleteCalculationById",
  CalculationController.deleteCalculationById
);

export const calculationRoutes = router;
