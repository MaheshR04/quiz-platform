import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Medal, Trophy } from "lucide-react";

import API from "../services/api";

function getBadge(index) {
  if (index === 0) return "bg-amber-100 text-amber-700";
  if (index === 1) return "bg-slate-200 text-slate-700";
  if (index === 2) return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-600";
}

function Leaderboard() {
  const location = useLocation();
  const incomingQuizId = location.state?.quizId;

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await API.get("/quiz");
        const items = response.data?.quizzes || [];
        setQuizzes(items);

        if (items.length > 0) {
          const hasIncoming = items.some((quiz) => quiz._id === incomingQuizId);
          setSelectedQuizId(hasIncoming ? incomingQuizId : items[0]._id);
        }
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load quizzes");
      }
    };

    fetchQuizzes();
  }, [incomingQuizId]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedQuizId) {
        setLoading(false);
        setLeaders([]);
        return;
      }

      setLoading(true);
      try {
        const response = await API.get(`/quiz/leaderboard/${selectedQuizId}`);
        setLeaders(response.data?.leaderboard || []);
      } catch (error) {
        setLeaders([]);
        alert(error.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedQuizId]);

  const selectedQuiz = quizzes.find((quiz) => quiz._id === selectedQuizId);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Leaderboard</h2>
            <p className="text-sm text-slate-500">Track top performers by quiz.</p>
          </div>

          <div className="w-full md:w-80">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Select Quiz
            </label>
            <select
              value={selectedQuizId}
              onChange={(event) => setSelectedQuizId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              {quizzes.length === 0 ? <option value="">No quizzes found</option> : null}
              {quizzes.map((quiz) => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2 text-slate-700">
          <Trophy size={18} className="text-amber-500" />
          <h3 className="text-lg font-semibold">
            {selectedQuiz ? `${selectedQuiz.title} Rankings` : "Quiz Rankings"}
          </h3>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            Loading leaderboard...
          </div>
        ) : leaders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            No attempts yet for this quiz.
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((entry, index) => {
              const percent = entry.totalQuestions
                ? Math.round((entry.score / entry.totalQuestions) * 100)
                : 0;

              return (
                <article
                  key={`${entry.user}-${index}`}
                  className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[90px_1fr_180px] md:items-center"
                >
                  <div
                    className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getBadge(
                      index
                    )}`}
                  >
                    <Medal size={14} />
                    Rank #{index + 1}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">{entry.user}</p>
                    <p className="text-sm text-slate-500">
                      Score: {entry.score} / {entry.totalQuestions}
                    </p>
                  </div>

                  <div className="text-right md:text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Accuracy</p>
                    <p className="text-xl font-semibold text-teal-700">{percent}%</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Leaderboard;
