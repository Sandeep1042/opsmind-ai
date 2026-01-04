import express from "express";
import { registerUser, loginUser, googleCallback } from "../controllers/authController.js";
import passport from "../config/passport.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);

export default router;
