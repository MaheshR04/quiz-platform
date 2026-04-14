import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ Send OTP
  const handleSendOtp = async () => {
    try {

      setLoading(true);

      await API.post("/auth/send-otp", { email, phone });

      alert("OTP sent successfully!");
      setStep(2);

    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP + Reset Password
  const handleReset = async () => {
    try {

      setLoading(true);

      await API.post("/auth/verify-otp", {
        email,
        phone,
        otp,
        newPassword: password
      });

      alert("Password reset successful!");

      // redirect
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-gray-200">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Password 🔐
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-3 mb-4 rounded focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full border p-3 mb-4 rounded focus:ring-2 focus:ring-blue-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              className="w-full border p-3 mb-4 rounded focus:ring-2 focus:ring-blue-400 text-center tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={4}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-3 mb-4 rounded focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
            >
              {loading ? "Processing..." : "Verify & Reset"}
            </button>

            {/* Back Button */}
            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 text-sm text-gray-500 hover:underline"
            >
              ← Change Email/Phone
            </button>
          </>
        )}

      </div>

    </div>
  );
}

export default ForgotPassword;