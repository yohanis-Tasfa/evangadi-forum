import { useContext, useEffect, useState } from "react";
import { AppState } from "../AppState";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useContext(AppState);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  const firstname = user?.firstname || "";

  function getInitials(text) {
    const t = (text || "").trim();
    if (!t) return "?";
    return t[0].toUpperCase();
  }

  async function fetchQuestions() {
    setIsLoading(true);
    setLoadError("");
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get("/question/all", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      // newest first
      setQuestions(data.data);
    } catch (error) {
      console.log(error?.response || error);
      setLoadError("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HERO */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-sm text-gray-500">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
                {firstname ? `Hi, ${firstname}` : "Hi"}
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Ask a question, help others, and learn faster with the
                community.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchQuestions()}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate("/question")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Ask Question
              </button>
            </div>
          </div>
        </div>

        {/* LIST HEADER */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <p className="text-sm text-gray-500">
              {questions.length}{" "}
              {questions.length === 1 ? "question" : "questions"}
            </p>
          </div>
        </div>

        {/* STATES */}
        {loadError ? (
          <div className="bg-white border border-red-100 text-red-700 rounded-xl p-4">
            {loadError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
            <p className="text-gray-900 font-medium">No questions yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Be the first to ask something.
            </p>
            <button
              onClick={() => navigate("/question")}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Ask your first question
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {questions.map((q) => (
              <button
                type="button"
                key={q.questionid}
                onClick={() => navigate(`/question/${q.questionid}`)}
                className="w-full text-left flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-semibold shrink-0">
                    {getInitials(q.username || firstname)}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {q.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Asked by {q.username}
                    </p>
                  </div>
                </div>

                <span className="text-gray-300 text-2xl leading-none">›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
