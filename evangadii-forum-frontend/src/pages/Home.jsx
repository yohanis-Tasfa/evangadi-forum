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
          <div className="space-y-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.questionid}
                onClick={() => navigate(`/question/${q.questionid}`)}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 transition cursor-pointer overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex gap-4">
                    {/* Stats Column */}
                    <div className="hidden sm:flex flex-col items-center gap-2 min-w-[70px]">
                      <div className={`text-center px-3 py-2 rounded-lg ${
                        (q.answerCount || 0) > 0 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <p className={`text-lg font-semibold ${
                          (q.answerCount || 0) > 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {q.answerCount || 0}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(q.answerCount || 0) === 1 ? 'answer' : 'answers'}
                        </p>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition line-clamp-2">
                        {q.title}
                      </h3>
                      
                      {q.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {q.description}
                        </p>
                      )}

                      {/* Tags & Meta */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {q.tag && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {q.tag}
                          </span>
                        )}
                        
                        {/* Mobile answer count */}
                        <span className="sm:hidden inline-flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          {q.answerCount || 0} answers
                        </span>

                        <div className="flex items-center gap-2 ml-auto">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                            {getInitials(q.username || q.firstname)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {q.firstname || q.username}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
