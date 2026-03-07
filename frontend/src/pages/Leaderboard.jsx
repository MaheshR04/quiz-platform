import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Leaderboard() {

  const [leaders, setLeaders] = useState([]);

  useEffect(() => {

    const fetchLeaderboard = async () => {

      try {

        const res = await API.get("/quiz/leaderboard");

        setLeaders(res.data.leaderboard);

      } catch (error) {

        console.error(error);

      }

    };

    fetchLeaderboard();

  }, []);

  return (

    <>
      <Navbar />

      <div className="p-10">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Leaderboard
        </h1>

        {leaders.map((user, index) => (

          <div
            key={index}
            className="border p-4 mb-4 rounded shadow"
          >

            <h2 className="text-xl font-semibold">
              {index + 1}. {user.user} — {user.score}
            </h2>

          </div>

        ))}

      </div>
    </>

  );
}

export default Leaderboard;