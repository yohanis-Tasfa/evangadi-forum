import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* LEFT */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-white">EVAN</span>
              <span className="text-orange-500">GADI</span>
            </h2>
            <p className="text-sm text-gray-400 mt-3 max-w-sm">
              A Q&A space for learners to ask questions, share knowledge, and grow together.
            </p>

            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 hover:text-orange-500 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 hover:text-orange-500 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 hover:text-orange-500 transition"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* MIDDLE */}
          <div>
            <h3 className="text-white font-semibold mb-4">Useful links</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300 hover:text-orange-500 cursor-pointer transition">
                How it works
              </li>
              <li className="text-gray-300 hover:text-orange-500 cursor-pointer transition">
                Terms of Service
              </li>
              <li className="text-gray-300 hover:text-orange-500 cursor-pointer transition">
                Privacy policy
              </li>
            </ul>
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Evangadi Networks</li>
              <li>support@evangadi.com</li>
              <li>+1-202-386-2702</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Evangadi Forum. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with React, Express, and MySQL.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
