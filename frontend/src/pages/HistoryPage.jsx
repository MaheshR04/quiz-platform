import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChartNoAxesColumn, ClipboardCheck, Download } from "lucide-react";
import { getCurrentUser } from "../utils/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import API from "../services/api";


function HistoryPage() {
  const [data, setData] = useState({ quizzes: [], history: [] });
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => getCurrentUser(), []);
  const isAdmin = user.role === "admin";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [quizRes, historyRes] = await Promise.all([
          API.get("/quiz"),
          API.get("/quiz/history")
        ]);
        setData({
          quizzes: quizRes.data?.quizzes || [],
          history: historyRes.data?.history || []
        });
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const { quizzes, history } = data;

  // Merge quizzes with their latest attempt for the current user
  const mergedData = useMemo(() => {
    if (isAdmin) return history; // Admins see raw history (all student attempts)

    return quizzes.map((quiz) => {
      const latestAttempt = history
        .filter((h) => (h.quizId?._id || h.quizId) === quiz._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      return {
        _id: quiz._id,
        quizTitle: quiz.title,
        attempt: latestAttempt,
        status: latestAttempt ? "Attempted" : "Not Attempted"
      };
    });
  }, [quizzes, history, isAdmin]);

  const stats = useMemo(() => {
    if (history.length === 0) return { best: 0, avg: 0 };
    const percentages = history.map((item) =>
      item.totalQuestions ? Math.round((item.score / item.totalQuestions) * 100) : 0
    );
    const best = Math.max(...percentages);
    const avg = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
    return { best, avg };
  }, [history]);

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Quiz Attempt Results", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      const tableColumn = ["Quiz Title", "Student", "Score", "Accuracy", "Date"];
      const tableRows = history.map((item) => [
        item.quizId?.title || "Unknown Quiz",
        item.userId?.name || item.userId?.email || "Unknown",
        `${item.score}/${item.totalQuestions}`,
        `${item.totalQuestions ? Math.round((item.score / item.totalQuestions) * 100) : 0}%`,
        new Date(item.createdAt).toLocaleString()
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: "striped",
        headStyles: { fillColor: [13, 148, 136] },
        styles: { fontSize: 9 }
      });

      doc.save(`quiz_history_${new Date().getTime()}.pdf`);
    } catch (pdfError) {
      console.error("PDF Generation Error:", pdfError);
      alert("Could not generate PDF.");
    }
  };

  return (
    <div className="space-y-6">
      <section className={`grid gap-4 ${isAdmin ? "md:grid-cols-3" : "md:grid-cols-1"}`}>
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-lg bg-cyan-50 p-2 text-cyan-600">
            <ClipboardCheck size={18} />
          </div>
          <p className="text-sm text-slate-500">Total Attempts</p>
          <h3 className="text-3xl font-semibold text-slate-900">{history.length}</h3>
        </article>

        {isAdmin && (
          <>
            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <ChartNoAxesColumn size={18} />
              </div>
              <p className="text-sm text-slate-500">Average Score</p>
              <h3 className="text-3xl font-semibold text-slate-900">{stats.avg}%</h3>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-amber-50 p-2 text-amber-600">
                <CalendarDays size={18} />
              </div>
              <p className="text-sm text-slate-500">Best Score</p>
              <h3 className="text-3xl font-semibold text-slate-900">{stats.best}%</h3>
            </article>
          </>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {isAdmin ? "All Student Attempts" : "Your Progress & History"}
          </h2>
          {isAdmin && history.length > 0 && (
            <button
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
            >
              <Download size={16} />
              Download PDF
            </button>
          )}
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            Loading data...
          </div>
        ) : mergedData.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            No data available.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Quiz</th>
                  {isAdmin && <th className="px-4 py-3">Student</th>}
                  {isAdmin && <th className="px-4 py-3">Score</th>}
                  {isAdmin && <th className="px-4 py-3">Accuracy</th>}
                  <th className="px-4 py-3">Date</th>
                  {!isAdmin && <th className="px-4 py-3 text-right">Status</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm">
                {mergedData.map((item, index) => {
                  const attempt = isAdmin ? item : item.attempt;
                  const quizTitle = isAdmin ? (item.quizId?.title || "Unknown Quiz") : item.quizTitle;
                  const studentName = isAdmin ? (item.userId?.name || item.userId?.email || "Unknown") : "";
                  const score = attempt ? `${attempt.score}/${attempt.totalQuestions}` : "-";
                  const accuracy = attempt && attempt.totalQuestions
                    ? `${Math.round((attempt.score / attempt.totalQuestions) * 100)}%`
                    : "-";
                  const date = attempt ? new Date(attempt.createdAt).toLocaleString() : "Never";
                  const status = isAdmin ? "Attempted" : item.status;

                  return (
                    <tr key={attempt?._id || `merged-${index}`}>
                      <td className="px-4 py-3 font-medium text-slate-800">{quizTitle}</td>
                      {isAdmin && <td className="px-4 py-3 text-slate-600">{studentName}</td>}
                      {isAdmin && <td className="px-4 py-3 text-slate-600">{score}</td>}
                      {isAdmin && <td className="px-4 py-3 font-semibold text-teal-700">{accuracy}</td>}
                      <td className="px-4 py-3 text-slate-500">{date}</td>
                      {!isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              status === "Attempted"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      )}
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
