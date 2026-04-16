import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>

      {/* ✅ Navbar inside Router */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/history" element={<History />} />
        
      </Routes>

    </BrowserRouter>
  );
}

export default App;