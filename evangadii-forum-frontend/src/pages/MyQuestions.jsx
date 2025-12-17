import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { AppState } from "../AppState";

function MyQuestions() {
  const { user } = useContext(AppState);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyQuestions() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`/question/user/${user.userid}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setQuestions(data.data || []);
      } catch (error) {
        console.log(error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMyQuestions();
  }, [user]);

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to see your questions.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">My Questions</h2>
          <button
            onClick={() => navigate("/question")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ask New Question
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading your questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500">
            You have not posted any questions yet. Click &quot;Ask New
            Question&quot; to create one.
          </p>
        ) : (
          <div className="bg-white rounded-md shadow divide-y">
            {questions.map((q) => (
              <div
                key={q.questionid}
                onClick={() => navigate(`/question/${q.questionid}`)}
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-800">{q.title}</p>
                  <p className="text-sm text-gray-500">
                    {q.tag ? `#${q.tag}` : "No tag"}
                  </p>
                </div>
                <span className="text-gray-400 text-xl">{">"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyQuestions;
