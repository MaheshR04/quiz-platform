import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChartNoAxesColumn, ClipboardCheck } from "lucide-react";

import API from "../services/api";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await API.get("/quiz/history");
        setHistory(response.data?.history || []);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const bestScore = useMemo(() => {
    if (history.length === 0) return 0;
    return history.reduce((best, item) => {
      const percent = item.totalQuestions ? Math.round((item.score / item.totalQuestions) * 100) : 0;
      return Math.max(best, percent);
    }, 0);
  }, [history]);

  const averageScore = useMemo(() => {
    if (history.length === 0) return 0;
    const sum = history.reduce((total, item) => {
      const percent = item.totalQuestions ? (item.score / item.totalQuestions) * 100 : 0;
      return total + percent;
    }, 0);
    return Math.round(sum / history.length);
  }, [history]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-lg bg-cyan-50 p-2 text-cyan-600">
            <ClipboardCheck size={18} />
          </div>
          <p className="text-sm text-slate-500">Total Attempts</p>
          <h3 className="text-3xl font-semibold text-slate-900">{history.length}</h3>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-lg bg-emerald-50 p-2 text-emerald-600">
            <ChartNoAxesColumn size={18} />
          </div>
          <p className="text-sm text-slate-500">Average Score</p>
          <h3 className="text-3xl font-semibold text-slate-900">{averageScore}%</h3>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-lg bg-amber-50 p-2 text-amber-600">
            <CalendarDays size={18} />
          </div>
          <p className="text-sm text-slate-500">Best Score</p>
          <h3 className="text-3xl font-semibold text-slate-900">{bestScore}%</h3>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Attempt History</h2>

        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            You have not attempted any quiz yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Quiz</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm">
                {history.map((item) => {
                  const percent = item.totalQuestions
                    ? Math.round((item.score / item.totalQuestions) * 100)
                    : 0;
                  return (
                    <tr key={item._id}>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {item.quizId?.title || "Unknown Quiz"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.score}/{item.totalQuestions}
                      </td>
                      <td className="px-4 py-3 font-semibold text-teal-700">{percent}%</td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default HistoryPage;
