import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppState } from "../AppState";

function Header() {
  const navigate = useNavigate();
  const { user, setuser } = useContext(AppState) || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    if (setuser) setuser(null);
    navigate("/login", { replace: true });
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        {/* LOGO - Left */}
        <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight mr-8">
          <span className="text-white">EVAN</span>
          <span className="text-orange-400">GADI</span>
        </Link>

        {/* NAV - Left aligned after logo */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          <Link
            to="/home"
            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition font-medium"
          >
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/my-questions"
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition font-medium"
              >
                My Questions
              </Link>
              <Link
                to="/my-answers"
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition font-medium"
              >
                My Answers
              </Link>
            </>
          )}
        </nav>

        {/* Auth Button - Right */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {user && (
            <span className="text-gray-400 text-sm">
              Welcome, <span className="text-orange-400 font-medium">{user.firstname}</span>
            </span>
          )}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition shadow-md hover:shadow-lg"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden ml-auto p-2 text-gray-300 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3">
          <nav className="flex flex-col gap-2">
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/my-questions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
                >
                  My Questions
                </Link>
                <Link
                  to="/my-answers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
                >
                  My Answers
                </Link>
              </>
            )}
            <div className="border-t border-slate-700 my-2"></div>
            {user ? (
              <button
                type="button"
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition text-center"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition text-center"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
