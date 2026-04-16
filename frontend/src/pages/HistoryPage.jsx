import { useEffect, useState } from "react";
import API from "../services/api";

function HistoryPage() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await API.get("/quiz/history");

        console.log("History API:", res.data);

        if (res.data && res.data.history) {
          setHistory(res.data.history);
        } else {
          setHistory([]);
        }

      } catch (error) {

        console.log("History error:", error);
        setHistory([]);

      } finally {
        setLoading(false);
      }

    };

    fetchHistory();

  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading history...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-center mb-6">
        Quiz Attempt History
      </h1>

      {history.length === 0 ? (

        <p className="text-center text-gray-500">
          No attempts yet.
        </p>

      ) : (

        <table className="w-full border shadow">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Quiz</th>
              <th className="p-2">Score</th>
              <th className="p-2">Total</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>

          <tbody>

            {history.map((item) => (

              <tr key={item._id} className="text-center border">

                <td className="p-2">
                  {item.quizId?.title || item.quizId}
                </td>

                <td className="p-2">
                  {item.score}
                </td>

                <td className="p-2">
                  {item.totalQuestions}
                </td>

                <td className="p-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default HistoryPage;