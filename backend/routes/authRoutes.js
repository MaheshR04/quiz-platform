import express from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtpAndReset
} from "../controllers/authController.js";

const router = express.Router();

// ✅ Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ OTP Reset Flow
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndReset);

export default router;