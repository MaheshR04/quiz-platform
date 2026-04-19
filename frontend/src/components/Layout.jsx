import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-xl font-bold text-green-600 mb-6">
          📘 QuizMaster
        </h2>

        <nav className="space-y-3">
          <a href="/quizzes" className="block hover:text-green-600">
            Dashboard
          </a>

          <a
            href="/admin/create-quiz"
            className="block bg-green-100 p-2 rounded text-green-700"
          >
            Create Quiz
          </a>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1">

        <Navbar />

        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;