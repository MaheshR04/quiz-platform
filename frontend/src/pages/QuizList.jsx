import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  ChartSpline,
  CirclePlay,
  ClipboardCheck,
  Pencil,
  PlusCircle,
  Trash2
} from "lucide-react";

import API from "../services/api";
import { getCurrentUser } from "../utils/auth";

function percentage(score, total) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

function QuizList() {
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);
  const isAdmin = user.role === "admin";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [quizRes, historyRes] = await Promise.all([
          API.get("/quiz"),
          API.get("/quiz/history").catch(() => ({ data: { history: [] } }))
        ]);

        setQuizzes(quizRes.data?.quizzes || []);
        setHistory(historyRes.data?.history || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const completedQuizIds = useMemo(
    () => new Set(history.map((item) => item.quizId?._id || item.quizId)),
    [history]
  );

  const bestScore = useMemo(
    () => history.reduce((best, item) => Math.max(best, percentage(item.score, item.totalQuestions)), 0),
    [history]
  );

  const pendingCount = useMemo(
    () => quizzes.filter((quiz) => !completedQuizIds.has(quiz._id)).length,
    [quizzes, completedQuizIds]
  );

  const dashboardCards = isAdmin
    ? [
        {
          title: "Total Quizzes",
          value: quizzes.length,
          description: "Published and ready for participants.",
          icon: BookOpenCheck
        },
        {
          title: "Your Attempts",
          value: history.length,
          description: "Attempts recorded for your account.",
          icon: ClipboardCheck
        },
        {
          title: "Best Personal Score",
          value: `${bestScore}%`,
          description: "Highest percentage from your own attempts.",
          icon: ChartSpline
        }
      ]
    : [
        {
          title: "Available Quizzes",
          value: quizzes.length,
          description: "New quizzes you can attempt now.",
          icon: BookOpenCheck
        },
        {
          title: "Completed Quizzes",
          value: completedQuizIds.size,
          description: "Quizzes you have already attempted.",
          icon: ClipboardCheck
        },
        {
          title: "Best Score",
          value: `${bestScore}%`,
          description: "Your strongest performance so far.",
          icon: ChartSpline
        }
      ];

  const deleteQuiz = async (id) => {
    const confirmed = window.confirm("Delete this quiz?");
    if (!confirmed) return;

    try {
      await API.delete(`/quiz/${id}`);
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== id));
    } catch (deleteError) {
      alert(deleteError.response?.data?.message || "Failed to delete quiz");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 text-center text-slate-600 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-white/50 bg-gradient-to-r from-teal-700 via-cyan-600 to-sky-600 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              {isAdmin ? "Admin Workspace" : "Student Workspace"}
            </p>
            <h2 className="mb-2 text-3xl font-semibold">
              {isAdmin ? "Manage quizzes with confidence" : "Keep your quiz streak active"}
            </h2>
            <p className="max-w-xl text-sm text-cyan-50/90">
              {isAdmin
                ? "Create, edit, and monitor your quiz collection from one place."
                : "Track your progress, start a new attempt, and climb the leaderboard."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isAdmin ? (
              <button
                onClick={() => navigate("/admin/create-quiz")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-cyan-50"
              >
                <PlusCircle size={16} />
                Create Quiz
              </button>
            ) : (
              <button
                onClick={() => navigate("/available-quizzes")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-cyan-50"
              >
                Browse Quizzes
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{card.title}</p>
                <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                  <Icon size={18} />
                </div>
              </div>
              <h3 className="text-3xl font-semibold text-slate-900">{card.value}</h3>
              <p className="mt-2 text-sm text-slate-500">{card.description}</p>
            </article>
          );
        })}
      </section>

      {!isAdmin && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          You still have <span className="font-semibold">{pendingCount}</span> quizzes not attempted yet.
          Keep going to improve your ranking.
        </section>
      )}

      <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            {isAdmin ? "Recent Quizzes" : "Quick Start"}
          </h3>
          <button
            onClick={() => navigate("/available-quizzes")}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            View all
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            No quizzes found yet.
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.slice(0, 6).map((quiz) => (
              <article
                key={quiz._id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h4 className="font-semibold text-slate-900">{quiz.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">{quiz.description || "No description added."}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {quiz.questions?.length || 0} questions
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                  >
                    <CirclePlay size={16} />
                    Start
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => navigate(`/admin/edit-quiz/${quiz._id}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default QuizList;
