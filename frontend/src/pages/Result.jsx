import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, History, Trophy } from "lucide-react";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 0, total = 0, quizTitle = "Quiz", quizId, autoSubmitted = false } = location.state || {};

  const percentage = useMemo(() => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  }, [score, total]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <section className="rounded-3xl border border-white/50 bg-gradient-to-r from-teal-700 via-cyan-600 to-sky-600 p-7 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Quiz Result</p>
        <h1 className="mt-1 text-3xl font-semibold">{quizTitle}</h1>
        {autoSubmitted ? (
          <p className="mt-2 text-sm text-cyan-50">Time ended, so your quiz was submitted automatically.</p>
        ) : (
          <p className="mt-2 text-sm text-cyan-50">Great effort. Here is your latest score summary.</p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Score</p>
          <h2 className="text-3xl font-semibold text-slate-900">
            {score}/{total}
          </h2>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Accuracy</p>
          <h2 className="text-3xl font-semibold text-teal-700">{percentage}%</h2>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Performance</p>
          <h2 className="text-3xl font-semibold text-slate-900">
            {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Keep Practicing"}
          </h2>
        </article>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/quizzes")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Dashboard
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => navigate("/history")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <History size={16} />
          Attempt History
        </button>

        <button
          onClick={() => navigate("/leaderboard", { state: { quizId } })}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Trophy size={16} />
          Leaderboard
        </button>
      </div>
    </div>
  );
}

export default Result;
