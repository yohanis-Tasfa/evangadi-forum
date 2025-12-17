import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppState } from "../AppState";

function Header() {
  const navigate = useNavigate();
  const { user, setuser } = useContext(AppState) || {};

  function handleLogout() {
    localStorage.removeItem("token");
    if (setuser) setuser(null);
    navigate("/login", { replace: true });
  }

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold">
          <span className="text-gray-900">EVAN</span>
          <span className="text-orange-500">GADI</span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-8">
          <Link
            to="/home"
            className="text-gray-700 hover:text-orange-500 transition"
          >
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/my-questions"
                className="text-gray-700 hover:text-orange-500 transition"
              >
                My Questions
              </Link>
              <Link
                to="/my-answers"
                className="text-gray-700 hover:text-orange-500 transition"
              >
                My Answers
              </Link>
            </>
          )}

          {/* <a
            href="#how-it-works"
            className="text-gray-700 hover:text-orange-500 transition"
          >
            How it Works
          </a> */}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#2d2f6f] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
            >
              SIGN IN
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
