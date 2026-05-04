import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AUTH_ROLES = ["admin", "student"];

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not defined for token signing");
    throw new Error("Server authentication configuration missing");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const normalizedRole = String(role || "student").trim().toLowerCase();

    if (!name || !email || !phone || !password || !normalizedRole) {
      return res.status(400).json({
        message: "Please fill all fields (including role)"
      });
    }

    if (!AUTH_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        message: "Please choose Admin or Student role"
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
      role: normalizedRole
    });

    res.status(201).json({
      message: "User registered successfully",
      token: createToken(user),
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
    const { email, password, role } = req.body;
    const normalizedRole = String(role || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (normalizedRole && !AUTH_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        message: "Please choose Admin or Student role"
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

    if (normalizedRole && user.role !== normalizedRole) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}`
      });
    }

    res.json({
      message: "Login successful",
      token: createToken(user),
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

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

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
