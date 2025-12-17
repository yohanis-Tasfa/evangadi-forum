import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { AppState } from "../AppState";

function MyAnswers() {
  const { user } = useContext(AppState);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyAnswers() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`/answer/user/${user.userid}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setAnswers(data.answers || []);
      } catch (error) {
        console.log(error);
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMyAnswers();
  }, [user]);

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to see your answers.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">My Answers</h2>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading your answers...</p>
        ) : answers.length === 0 ? (
          <p className="text-gray-500">
            You have not posted any answers yet. Go to a question and provide
            an answer!
          </p>
        ) : (
          <div className="bg-white rounded-md shadow divide-y">
            {answers.map((ans) => (
              <div
                key={ans.answerid}
                onClick={() => navigate(`/question/${ans.questionid}`)}
                className="flex items-start justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{ans.answer}</p>
                  <p className="text-sm text-gray-500">
                    Click to view question
                  </p>
                </div>
                <span className="text-gray-400 text-xl ml-4">{">"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyAnswers;

