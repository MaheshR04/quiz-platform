import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";

function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await API.post(`/quiz/start/${id}`);
        const quizData = response.data?.quiz;

        if (!quizData) {
          alert("Quiz not found.");
          navigate("/quizzes");
          return;
        }

        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(null));
        setTimeLeft(quizData.timeLimit || 60);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load quiz");
        navigate("/quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  const answeredCount = useMemo(
    () => answers.filter((answer) => answer !== null).length,
    [answers]
  );

  const handleSelect = (questionIndex, optionIndex) => {
    setAnswers((prev) => prev.map((answer, index) => (index === questionIndex ? optionIndex : answer)));
  };

  const submitQuiz = useCallback(
    async (isAutoSubmit = false) => {
      if (submitting || !quiz) return;

      setSubmitting(true);
      try {
        const normalizedAnswers = answers.map((answer) => (answer === null ? -1 : answer));
        const response = await API.post("/quiz/submit", {
          quizId: id,
          answers: normalizedAnswers
        });

        navigate("/result", {
          state: {
            score: response.data?.score ?? 0,
            total: response.data?.totalQuestions ?? quiz.questions.length,
            quizTitle: quiz.title,
            quizId: id,
            autoSubmitted: isAutoSubmit
          }
        });
      } catch (error) {
        alert(error.response?.data?.message || "Failed to submit quiz");
        setSubmitting(false);
      }
    },
    [answers, id, navigate, quiz, submitting]
  );

  useEffect(() => {
    if (!quiz || submitting) return;

    if (timeLeft === 10 && !warningShown) {
      alert("Only 10 seconds left.");
      setWarningShown(true);
    }

    if (timeLeft <= 0) {
      submitQuiz(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [quiz, submitting, timeLeft, submitQuiz, warningShown]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 text-slate-600 shadow-sm">
          Loading quiz...
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 rounded-3xl border border-white/50 bg-gradient-to-r from-teal-700 via-cyan-600 to-sky-600 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Live Attempt</p>
              <h1 className="text-3xl font-semibold">{quiz.title}</h1>
              <p className="mt-1 text-sm text-cyan-50">{quiz.description || "Answer all questions carefully."}</p>
            </div>

            <div className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold">
              Time Left: <span className={timeLeft <= 10 ? "text-amber-200" : "text-white"}>{timeLeft}s</span>
            </div>
          </div>
        </header>

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white/85 p-4 text-sm text-slate-600 shadow-sm">
          Answered {answeredCount} of {quiz.questions.length} questions
        </section>

        <div className="space-y-4">
          {quiz.questions.map((question, questionIndex) => (
            <article
              key={`question-${questionIndex}`}
              className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Question {questionIndex + 1}
              </p>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">{question.question}</h2>

              <div className="grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[questionIndex] === optionIndex;
                  return (
                    <button
                      key={`option-${questionIndex}-${optionIndex}`}
                      onClick={() => handleSelect(questionIndex, optionIndex)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        isSelected
                          ? "border-teal-600 bg-teal-50 text-teal-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/quizzes")}
            disabled={submitting}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Exit Quiz
          </button>
          <button
            onClick={() => submitQuiz(false)}
            disabled={submitting}
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
