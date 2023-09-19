import express from "express";
import { authRoutes } from "./auth.routes";
import { calculationRoutes } from "./calculation.routes";
import { AuthController } from "../Controllers/auth.controller";

const router = express.Router();

router.use("/", authRoutes);
router.use("/calculation", AuthController.protect, calculationRoutes);

export const masterRoutes = router;
