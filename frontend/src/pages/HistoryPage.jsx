import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChartNoAxesColumn, ClipboardCheck, Download } from "lucide-react";
import { getCurrentUser } from "../utils/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import API from "../services/api";


function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => getCurrentUser(), []);
  const isAdmin = user.role === "admin";

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

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Quiz Attempt Results", 14, 22);

      // Add timestamp
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
        headStyles: { fillColor: [13, 148, 136] }, // teal-600
        styles: { fontSize: 9 }
      });

      doc.save(`quiz_history_${new Date().getTime()}.pdf`);
    } catch (pdfError) {
      console.error("PDF Generation Error:", pdfError);
      alert("Could not generate PDF. Please check the console for details.");
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
              <h3 className="text-3xl font-semibold text-slate-900">{averageScore}%</h3>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-amber-50 p-2 text-amber-600">
                <CalendarDays size={18} />
              </div>
              <p className="text-sm text-slate-500">Best Score</p>
              <h3 className="text-3xl font-semibold text-slate-900">{bestScore}%</h3>
            </article>
          </>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Attempt History</h2>
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
                  {isAdmin && <th className="px-4 py-3">Student</th>}
                  {isAdmin && <th className="px-4 py-3">Score</th>}
                  {isAdmin && <th className="px-4 py-3">Accuracy</th>}
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
                      {isAdmin && (
                        <td className="px-4 py-3 text-slate-600">
                          {item.userId?.name || item.userId?.email || "Unknown"}
                        </td>
                      )}
                      {isAdmin && (
                        <td className="px-4 py-3 text-slate-600">
                          {item.score}/{item.totalQuestions}
                        </td>
                      )}
                      {isAdmin && <td className="px-4 py-3 font-semibold text-teal-700">{percent}%</td>}
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
