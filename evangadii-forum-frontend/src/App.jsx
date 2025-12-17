import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./axios";
import { OrbitProgress } from "react-loading-indicators";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import MyQuestions from "./pages/MyQuestions";
import MyAnswers from "./pages/MyAnswers";
import { AppState } from "./AppState";

function App() {
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // save token on local storage

  useEffect(() => {
    async function checkUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/users/check", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setuser(data);
      } catch {
        setuser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [token]);

  // ⛔ WAIT until auth check finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />
        </p>
      </div>
    );
  }

  return (
    <AppState.Provider value={{ user, setuser }}>
      <Header />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTE */}
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/question"
          element={user ? <AskQuestion /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-questions"
          element={user ? <MyQuestions /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-answers"
          element={user ? <MyAnswers /> : <Navigate to="/login" />}
        />
        <Route
          path="/question/:questionid"
          element={user ? <QuestionDetail /> : <Navigate to="/login" />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </AppState.Provider>
  );
}

export default App;
