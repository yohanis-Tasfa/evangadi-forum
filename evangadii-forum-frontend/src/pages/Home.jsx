import { useContext, useEffect, useState } from "react";
import { AppState } from "../AppState";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useContext(AppState);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  const firstname = user?.firstname || "";

  // Filter questions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredQuestions(questions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = questions.filter(
        (q) =>
          q.title?.toLowerCase().includes(query) ||
          q.description?.toLowerCase().includes(query) ||
          q.tag?.toLowerCase().includes(query) ||
          q.username?.toLowerCase().includes(query)
      );
      setFilteredQuestions(filtered);
    }
  }, [searchQuery, questions]);

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

          {/* SEARCH BAR */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search questions by title, description, tag, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LIST HEADER */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <p className="text-sm text-gray-500">
              {searchQuery ? (
                <>
                  {filteredQuestions.length} of {questions.length} questions
                  {filteredQuestions.length === 0 && " match your search"}
                </>
              ) : (
                <>
                  {questions.length} {questions.length === 1 ? "question" : "questions"}
                </>
              )}
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
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
            {searchQuery ? (
              <>
                <p className="text-gray-900 font-medium">No questions found</p>
                <p className="text-gray-500 text-sm mt-1">
                  Try a different search term or clear the search.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {filteredQuestions.map((q) => (
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
                      Asked by {q.firstname}
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
