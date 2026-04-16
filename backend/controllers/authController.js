import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {

    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill all fields (including phone)"
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "student" // ✅ force student
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {

    const { email, phone } = req.body;

    const user = await User.findOne({ email, phone });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or phone number"
      });
    }

    // ✅ 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // 🔥 For now (testing)
    console.log("OTP:", otp);

    res.json({
      message: "OTP sent to your registered phone number"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= VERIFY OTP + RESET ================= */
export const verifyOtpAndReset = async (req, res) => {
  try {

    const { email, phone, otp, newPassword } = req.body;

    const user = await User.findOne({ email, phone });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // ✅ clear OTP
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
