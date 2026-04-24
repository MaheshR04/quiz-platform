import { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpenCheck,
  CircleHelp,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  ShieldCheck,
  Trophy,
  X
} from "lucide-react";

import { clearAuth, getCurrentUser } from "../utils/auth";

const PAGE_TITLES = {
  "/quizzes": "Dashboard",
  "/available-quizzes": "Available Quizzes",
  "/leaderboard": "Leaderboard",
  "/history": "Attempt History",
  "/settings": "Settings",
  "/profile-settings": "Profile Settings",
  "/help": "Study Tips",
  "/admin/create-quiz": "Create Quiz",
  "/result": "Result"
};

function getPageTitle(pathname) {
  if (pathname.startsWith("/admin/edit-quiz")) return "Edit Quiz";
  if (pathname.startsWith("/quiz/")) return "Take Quiz";
  return PAGE_TITLES[pathname] || "Quiz Platform";
}

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useMemo(() => getCurrentUser(), []);
  const isAdmin = user.role === "admin";

  const navItems = isAdmin
    ? [
        { to: "/quizzes", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/create-quiz", label: "Create Quiz", icon: PlusCircle },
        { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
        { to: "/history", label: "History", icon: History },
        { to: "/settings", label: "Settings", icon: Settings }
      ]
    : [
        { to: "/quizzes", label: "Dashboard", icon: LayoutDashboard },
        { to: "/available-quizzes", label: "Available Quizzes", icon: BookOpenCheck },
        { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
        { to: "/history", label: "History", icon: History },
        { to: "/settings", label: "Settings", icon: Settings },
        { to: "/help", label: "Study Tips", icon: CircleHelp }
      ];

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  const isItemActive = (to) => {
    if (to === "/quizzes") {
      return location.pathname === "/quizzes" || location.pathname === "/dashboard";
    }
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <div className="min-h-screen text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200/60 bg-white/90 px-5 py-6 shadow-xl backdrop-blur transition-transform duration-200 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <button
              className="text-lg font-semibold tracking-tight text-teal-700"
              onClick={() => navigate("/quizzes")}
            >
              Quiz Nexus
            </button>
            <button
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-8 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-500 p-4 text-white shadow-lg">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <ShieldCheck size={14} />
              {isAdmin ? "Admin" : "Student"}
            </div>
            <p className="text-sm opacity-90">{user.name || user.email || "Quiz Learner"}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            aria-label="Close sidebar overlay"
          />
        )}

        <div className="flex min-h-screen w-full flex-col md:pl-72">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quiz Platform
                  </p>
                  <h1 className="text-lg font-semibold text-slate-900">{getPageTitle(location.pathname)}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 sm:flex">
                  <BarChart3 size={14} />
                  {isAdmin ? "Management Mode" : "Learning Mode"}
                </div>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
