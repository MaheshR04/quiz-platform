import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3, Search, Trophy } from "lucide-react";

import API from "../services/api";

function AvailableQuizzes() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [quizRes, historyRes] = await Promise.all([
          API.get("/quiz"),
          API.get("/quiz/history").catch(() => ({ data: { history: [] } }))
        ]);
        setQuizzes(quizRes.data?.quizzes || []);
        setHistory(historyRes.data?.history || []);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const attemptedQuizIds = useMemo(
    () => new Set(history.map((item) => item.quizId?._id || item.quizId)),
    [history]
  );

  const filteredQuizzes = quizzes.filter((quiz) => {
    const term = search.toLowerCase();
    return (
      quiz.title?.toLowerCase().includes(term) ||
      quiz.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm md:p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Available Quizzes</h2>
            <p className="text-sm text-slate-500">
              Pick a quiz, start instantly, and improve your leaderboard score.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or description"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            Loading quizzes...
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            No quizzes match your search.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredQuizzes.map((quiz) => {
              const attempted = attemptedQuizIds.has(quiz._id);

              return (
                <article
                  key={quiz._id}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">{quiz.title}</h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        attempted ? "bg-emerald-100 text-emerald-700" : "bg-cyan-100 text-cyan-700"
                      }`}
                    >
                      {attempted ? "Attempted" : "New"}
                    </span>
                  </div>

                  <p className="mb-4 text-sm text-slate-500">
                    {quiz.description || "No description provided."}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                      <Trophy size={13} />
                      {quiz.questions?.length || 0} Questions
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                      <Clock3 size={13} />
                      {quiz.timeLimit || 60} sec
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="mt-auto rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Start Quiz
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default AvailableQuizzes;
