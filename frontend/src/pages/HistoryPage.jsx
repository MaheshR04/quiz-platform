import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function HistoryPage() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await API.get("/attempts");

        setHistory(res.data);

      } catch (error) {
        console.log(error);
      }

    };

    fetchHistory();

  }, []);

  return (

    <>
      <Navbar />

      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Quiz Attempt History
        </h1>

        {history.length === 0 ? (

          <p>No attempts yet.</p>

        ) : (

          <table className="w-full border">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Quiz ID</th>
                <th className="p-2">Score</th>
                <th className="p-2">Total Questions</th>
              </tr>
            </thead>

            <tbody>

              {history.map((item) => (

                <tr key={item._id} className="text-center border">

                  <td className="p-2">{item.quizId}</td>
                  <td className="p-2">{item.score}</td>
                  <td className="p-2">{item.totalQuestions}</td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </>

  );

}

export default HistoryPage;