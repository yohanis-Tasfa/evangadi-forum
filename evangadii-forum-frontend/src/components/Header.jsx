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
    <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight">
          <span className="text-gray-900">EVAN</span>
          <span className="text-orange-500">GADI</span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            to="/home"
            className="px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/my-questions"
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
              >
                My Questions
              </Link>
              <Link
                to="/my-answers"
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
              >
                My Answers
              </Link>
            </>
          )}

          <div className="w-px h-6 bg-gray-200 hidden sm:block" />

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-gray-900 text-white px-4 sm:px-5 py-2 rounded-lg font-medium hover:bg-black transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
