import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, History, LogOut, Shield, UserRound } from "lucide-react";

import { clearAuth, getCurrentUser } from "../utils/auth";

function Settings() {
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
            <UserRound size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Account Settings</h2>
            <p className="text-sm text-slate-500">Manage your profile and account actions.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">{user.name || "Quiz User"}</p>
          <p className="text-sm text-slate-500">{user.email || "No email found"}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Role: {user.role || "student"}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-sm">
        <button
          onClick={() => navigate("/profile-settings")}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <UserRound size={16} />
            Profile Settings
          </span>
          <ChevronRight size={16} className="text-slate-400" />
        </button>

        <button
          onClick={() => navigate("/history")}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <History size={16} />
            Attempt History
          </span>
          <ChevronRight size={16} className="text-slate-400" />
        </button>

        <button
          type="button"
          className="flex w-full cursor-default items-center justify-between rounded-2xl px-4 py-3 text-left"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
            <Shield size={16} />
            Security Controls (coming soon)
          </span>
        </button>
      </section>

      <button
        onClick={logout}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}

export default Settings;
