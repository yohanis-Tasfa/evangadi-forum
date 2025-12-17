import { useContext, useEffect, useState } from "react";
import { AppState } from "../AppState";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useContext(AppState);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  async function fetchQuestions() {
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
      console.log(error);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50">
      {/* TOP BAR */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold"></h1>

          <div className="flex items-center gap-6">
            <span className="text-gray-700">
              Welcome: <strong>{user?.firstname} </strong>
            </span>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ASK QUESTION */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/question")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            Ask Question
          </button>
        </div>

        {/* QUESTIONS */}
        <h2 className="text-xl font-semibold mb-4">Questions</h2>

        <div className="bg-white rounded-md shadow divide-y">
          {questions.map((q) => (
            <div
              key={q.questionid}
              onClick={() => navigate(`/question/${q.questionid}`)}
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  👤
                </div>

                <div>
                  <p className="font-medium text-gray-800">{q.title}</p>
                  <p className="text-sm text-gray-500">{q.username}</p>
                </div>
              </div>

              <span className="text-gray-400 text-xl">{">"}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;
