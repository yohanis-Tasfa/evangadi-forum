import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#1e213a] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-white">EVAN</span>
            <span className="text-orange-500">GADI</span>
          </h2>

          <div className="flex gap-4 mt-4">
            <FaFacebookF className="cursor-pointer hover:text-orange-500" />
            <FaInstagram className="cursor-pointer hover:text-orange-500" />
            <FaYoutube className="cursor-pointer hover:text-orange-500" />
          </div>
        </div>

        {/* MIDDLE */}
        <div>
          <h3 className="text-white font-semibold mb-4">Useful Link</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-orange-500 cursor-pointer">
              How it works
            </li>
            <li className="hover:text-orange-500 cursor-pointer">
              Terms of Service
            </li>
            <li className="hover:text-orange-500 cursor-pointer">
              Privacy policy
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-2 text-sm">
            <li>Evangadi Networks</li>
            <li>support@evangadi.com</li>
            <li>+1-202-386-2702</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
