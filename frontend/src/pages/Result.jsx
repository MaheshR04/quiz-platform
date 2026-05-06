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
    <div className="flex min-h-[60vh] items-center justify-center">
      <section className="w-full max-w-2xl rounded-3xl border border-white/50 bg-gradient-to-r from-teal-700 via-cyan-600 to-sky-600 p-12 text-center text-white shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Quiz is submitted successfully</h1>
        <p className="mt-4 text-lg text-cyan-50 opacity-90">
          Your responses have been recorded. You can view your performance in the Attempt History.
        </p>
      </section>
    </div>
  );
}

export default Result;
