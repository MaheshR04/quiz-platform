import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email, phone });
      alert("OTP sent successfully.");
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", {
        email,
        phone,
        otp,
        newPassword: password
      });
      alert("Password reset successful.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/85 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Reset Password</h1>
        <p className="mb-6 text-sm text-slate-500">
          Verify your registered details and set a new password.
        </p>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Registered email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <input
              type="tel"
              placeholder="Registered phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mb-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              maxLength={4}
              placeholder="4-digit OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-center tracking-[0.45em] outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mb-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Processing..." : "Verify & Reset"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="mt-3 w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Change email or phone
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
