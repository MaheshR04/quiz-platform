import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { normalizeRole } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/auth/login", form);
      const user = response.data?.user || {};
      const token = response.data?.token;

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: normalizeRole(user.role)
        })
      );

      navigate("/quizzes");
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-2xl backdrop-blur">
        <div className="grid md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-teal-700 via-cyan-600 to-blue-600 p-10 text-white md:block">
            <h1 className="mb-4 text-4xl font-bold leading-tight">Welcome Back</h1>
            <p className="text-sm text-cyan-50">
              Login as admin or student and continue your quiz journey with dashboard analytics,
              attempts history, and leaderboard performance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            <h2 className="mb-1 text-2xl font-semibold text-slate-900">Sign In</h2>
            <p className="mb-6 text-sm text-slate-500">Use your account credentials to continue.</p>

            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              required
            />

            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="mb-6 text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-medium text-teal-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="mt-5 text-center text-sm text-slate-600">
              New user?{" "}
              <Link to="/register" className="font-semibold text-teal-700 hover:underline">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
