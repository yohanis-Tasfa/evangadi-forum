import Login from "./Login";
import Register from "./Register";
import { useState } from "react";

function Landing() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className="min-h-screen bg-[#CFD1EF] flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* LEFT */}
        {showLogin ? (
          <Login onSwitch={() => setShowLogin(false)} />
        ) : (
          <Register onSwitch={() => setShowLogin(true)} />
        )}

        {/* RIGHT */}
        <div className="hidden md:block">
          <p className="text-orange-500 font-medium mb-2">About</p>

          <h1 className="text-3xl font-bold mb-4">Evangadi Networks Q&amp;A</h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            No matter what stage of life you are in, whether you’re just
            starting elementary school or being promoted to CEO of a Fortune 500
            company, you have much to offer to those who are trying to follow in
            your footsteps.
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Whether you are willing to share your knowledge or you are just
            looking to meet mentors, Evangadi is the perfect place for you.
          </p>

          <button className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition">
            HOW IT WORKS
          </button>
        </div>
      </div>
    </main>
  );
}

export default Landing;
