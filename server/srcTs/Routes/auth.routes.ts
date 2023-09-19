import express from "express";
import { AuthController } from "../Controllers/auth.controller";
import passport from "passport";
import { errorResponse } from "../Utils/request.utils";

const router = express.Router();

router.post("/detect", AuthController.detect);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/401",
  }),
  AuthController.login
);
router.post("/register", AuthController.register);

router.post("/logout", AuthController.logout);

router.post("/401", (req, res) => {
  return errorResponse(res, "Invalid username or password");
});

export const authRoutes = router;
