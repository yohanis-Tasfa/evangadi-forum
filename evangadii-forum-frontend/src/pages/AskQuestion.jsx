import { useRef } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

function AskQuestion() {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const tagRef = useRef();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const tag = tagRef.current.value;

    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/question/create",
        {
          title,
          description,
          tag,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      alert("Question posted successfully");
      navigate("/home");
    } catch (error) {
      console.log(error);
      alert("Failed to post question");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-2">Ask a Question</h2>
        <p className="text-gray-600 mb-6">
          Summarize your problem in a one-line title. <br /> Describe your
          problem in more detail. <br /> Describe what you tried and what you
          expected to happen. <br />
          Review your question and post it to the site. <br /> Be specific and
          imagine you’re asking another person
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Question Title
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="e.g. How does React useEffect work?"
              className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Question Description
            </label>
            <textarea
              ref={descriptionRef}
              rows="6"
              placeholder="Explain your problem in detail..."
              className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          {/* TAG */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tag (optional)
            </label>
            <input
              ref={tagRef}
              type="text"
              placeholder="e.g. react, node, mysql"
              className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="px-6 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post Question
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AskQuestion;
