import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["teacher", "student", "admin"],
    default: "student"
  },

  // ✅ OTP fields
  otp: {
    type: String
  },

  otpExpiry: {
    type: Date
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);