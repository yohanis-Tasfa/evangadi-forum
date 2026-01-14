import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { AppState } from "../AppState";

function QuestionDetail() {
  const { questionid } = useParams();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");
  const [questionVotes, setQuestionVotes] = useState({ voteCount: 0, userVote: 0 });
  const [answerVotes, setAnswerVotes] = useState({});

  const { user } = useContext(AppState);

  const token = localStorage.getItem("token");

  // 🔹 Vote on question
  async function handleQuestionVote(voteType) {
    try {
      await axios.post(
        `/vote/question/${questionid}`,
        { vote_type: voteType },
        { headers: { Authorization: "Bearer " + token } }
      );
      fetchQuestionVotes();
    } catch (error) {
      console.log(error);
    }
  }

  // 🔹 Vote on answer
  async function handleAnswerVote(answerid, voteType) {
    try {
      await axios.post(
        `/vote/answer/${answerid}`,
        { vote_type: voteType },
        { headers: { Authorization: "Bearer " + token } }
      );
      fetchAnswerVotes(answerid);
    } catch (error) {
      console.log(error);
    }
  }

  // 🔹 Fetch question votes
  async function fetchQuestionVotes() {
    try {
      const { data } = await axios.get(`/vote/question/${questionid}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setQuestionVotes(data);
    } catch (error) {
      console.log(error);
    }
  }

  // 🔹 Fetch answer votes
  async function fetchAnswerVotes(answerid) {
    try {
      const { data } = await axios.get(`/vote/answer/${answerid}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setAnswerVotes((prev) => ({ ...prev, [answerid]: data }));
    } catch (error) {
      console.log(error);
    }
  }

  // Vote button component
  function VoteButtons({ voteCount, userVote, onUpvote, onDownvote }) {
    return (
      <div className="flex flex-col items-center gap-1 mr-4">
        <button
          onClick={onUpvote}
          className={`p-2 rounded-lg transition ${
            userVote === 1
              ? "bg-green-100 text-green-600"
              : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span className={`text-lg font-semibold ${
          voteCount > 0 ? "text-green-600" : voteCount < 0 ? "text-red-600" : "text-gray-600"
        }`}>
          {voteCount}
        </span>
        <button
          onClick={onDownvote}
          className={`p-2 rounded-lg transition ${
            userVote === -1
              ? "bg-red-100 text-red-600"
              : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  }

  const token = localStorage.getItem("token");

  // 🔹 Fetch question
  async function fetchQuestion() {
    try {
      const { data } = await axios.get(`/question/${questionid}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setQuestion(data.data);
      setEditTitle(data.data.title || "");
      setEditDescription(data.data.description || "");
      setEditTag(data.data.tag || "");
    } catch (error) {
      console.log(error);
    }
  }

  // 🔹 Fetch answers (SORTED newest → oldest)
  async function fetchAnswers() {
    try {
      const { data } = await axios.get(`/answer/question/${questionid}`, {
        headers: { Authorization: "Bearer " + token },
      });

      // backend returns either { answers: [...] } or { data: [...] }
      const list = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.answers)
        ? data.answers
        : [];

      // ✅ SORT BY `created_at` newest → oldest (new answers at top)
      const sorted = [...list].sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tb - ta;
      });

      setAnswers(sorted);
    } catch (error) {
      console.log(error);
      setAnswers([]);
    }
  }

  // 🔹 Submit answer
  async function handleSubmit(e) {
    e.preventDefault();
    if (!answerText.trim()) {
      alert("Please enter an answer before submitting.");
      return;
    }

    // Validate questionid
    if (!questionid || questionid === "0" || questionid === 0) {
      alert("Invalid question ID. Please navigate to a valid question page.");
      console.error("Invalid questionid:", questionid);
      return;
    }

    try {
      console.log("Submitting answer with:", {
        questionid,
        answerLength: answerText.length,
      });

      const response = await axios.post(
        "/answer/create",
        {
          answer: answerText.trim(),
          questionid,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server response:", response.data);

      // Update the UI with the new answer
      setAnswers((prev) => [
        {
          answerid: response.data.answerid || Date.now(),
          answer: answerText,
          username: user?.username || "You",
          created_at: new Date().toISOString(),
          userid: user?.userid,
        },
        ...prev,
      ]);

      setAnswerText("");
    } catch (error) {
      console.error("Error submitting answer:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });

      // Show error to user
      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.message ||
        "Failed to submit answer. Please try again.";
      alert(errorMessage);
    }
  }

  // 🔹 Begin editing an answer (owner only)
  function startEditAnswer(ans) {
    setEditingAnswerId(ans.answerid);
    setEditingAnswerText(ans.answer || "");
  }

  function cancelEditAnswer() {
    setEditingAnswerId(null);
    setEditingAnswerText("");
  }

  // 🔹 Save edited answer
  async function handleUpdateAnswer(e) {
    e.preventDefault();
    if (!editingAnswerText.trim() || !editingAnswerId) return;

    try {
      await axios.put(
        `/answer/update/${editingAnswerId}`,
        { answer: editingAnswerText },
        { headers: { Authorization: "Bearer " + token } }
      );

      // reflect changes locally
      setAnswers((prev) =>
        prev.map((a) =>
          a.answerid === editingAnswerId
            ? { ...a, answer: editingAnswerText }
            : a
        )
      );

      cancelEditAnswer();
    } catch (error) {
      console.log(error);
      alert("Failed to update answer");
    }
  }

  // 🔹 Delete answer (owner only)
  async function handleDeleteAnswer(answerid) {
    const confirmDelete = window.confirm(
      "Delete this answer? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/answer/delete/${answerid}`, {
        headers: { Authorization: "Bearer " + token },
      });

      setAnswers((prev) => prev.filter((a) => a.answerid !== answerid));
    } catch (error) {
      console.log(error);
      alert("Failed to delete answer");
    }
  }

  // 🔹 Update question (only owner)
  async function handleUpdateQuestion(e) {
    e.preventDefault();

    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      await axios.put(
        `/question/update/${questionid}`,
        {
          title: editTitle,
          description: editDescription,
          tag: editTag,
        },
        { headers: { Authorization: "Bearer " + token } }
      );

      // reflect changes in UI
      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              title: editTitle,
              description: editDescription,
              tag: editTag,
            }
          : prev
      );

      setIsEditing(false);
      alert("Question updated successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to update question");
    }
  }

  // 🔹 Delete question (only owner)
  async function handleDeleteQuestion() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/question/delete/${questionid}`, {
        headers: { Authorization: "Bearer " + token },
      });

      alert("Question deleted");
      window.location.href = "/home";
    } catch (error) {
      console.log(error);
      alert("Failed to delete question");
    }
  }

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
    fetchQuestionVotes();
  }, [questionid]);

  // Fetch votes for all answers when answers change
  useEffect(() => {
    answers.forEach((ans) => {
      if (ans.answerid && !answerVotes[ans.answerid]) {
        fetchAnswerVotes(ans.answerid);
      }
    });
  }, [answers]);

  if (!question) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow">
        {/* QUESTION */}
        <div className="flex gap-4 mb-4">
          {/* Vote buttons for question */}
          <VoteButtons
            voteCount={questionVotes.voteCount}
            userVote={questionVotes.userVote}
            onUpvote={() => handleQuestionVote(1)}
            onDownvote={() => handleQuestionVote(-1)}
          />

          <div className="flex-1">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                {isEditing ? (
              <form onSubmit={handleUpdateQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows="5"
                    className="w-full border rounded-md px-3 py-2 focus:ring outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tag (optional)
                  </label>
                  <input
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:ring outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(question.title || "");
                      setEditDescription(question.description || "");
                      setEditTag(question.tag || "");
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
                <p className="text-gray-700 mb-2">{question.description}</p>
                {question.tag && (
                  <span className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    #{question.tag}
                  </span>
                )}
              </>
            )}
          </div>

          {/* OWNER ACTIONS  */}
          {user && user.userid === question.userid && !isEditing && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
            </div>
          </div>
        </div>

        {!isEditing && (
          <p className="text-gray-500 mb-4">Question ID: {questionid}</p>
        )}

        <hr className="mb-6" />

        {/* ANSWERS */}
        <h2 className="text-xl font-semibold mb-4">
          Answers ({answers.length})
        </h2>

        {answers.length === 0 ? (
          <p className="text-gray-500 mb-4">No answers yet.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {answers.map((ans) => (
              <div
                key={ans.answerid}
                className="border rounded-md p-4 bg-gray-50 flex gap-4"
              >
                {/* Vote buttons for answer */}
                <VoteButtons
                  voteCount={answerVotes[ans.answerid]?.voteCount || 0}
                  userVote={answerVotes[ans.answerid]?.userVote || 0}
                  onUpvote={() => handleAnswerVote(ans.answerid, 1)}
                  onDownvote={() => handleAnswerVote(ans.answerid, -1)}
                />

                <div className="flex-1">
                  {editingAnswerId === ans.answerid ? (
                  <form onSubmit={handleUpdateAnswer} className="space-y-3">
                    <textarea
                      value={editingAnswerText}
                      onChange={(e) => setEditingAnswerText(e.target.value)}
                      className="w-full border rounded-md p-3 focus:ring outline-none"
                      rows="4"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditAnswer}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-gray-800">{ans.answer}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Answered by <strong>{ans.username}</strong>
                    </p>
                    {user && user.userid === ans.userid && (
                      <div className="flex gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => startEditAnswer(ans)}
                          className="px-3 py-1 text-sm bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAnswer(ans.answerid)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* POST ANSWER */}
        <form onSubmit={handleSubmit}>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write your answer..."
            className="w-full border rounded-md p-3 mb-4 focus:ring outline-none"
            rows="4"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Post Answer
          </button>
        </form>
      </div>
    </section>
  );
}

export default QuestionDetail;
