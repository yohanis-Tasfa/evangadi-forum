import { useRef, useContext } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../AppState";

function Login({ onSwitch }) {
  const navigate = useNavigate();
  const { setuser } = useContext(AppState);

  const emailDom = useRef();
  const passwordDom = useRef();

  async function handlesubmit(e) {
    e.preventDefault();

    const emailValue = emailDom.current.value;
    const passwordValue = passwordDom.current.value;

    if (!emailValue || !passwordValue || passwordValue.length < 8) {
      alert(
        "please provide all required information and password must be at least 8 characters"
      );
      return;
    }

    try {
      const loginRes = await axios.post("/users/login", {
        email: emailValue,
        password: passwordValue,
      });

      const token = loginRes.data.token;
      localStorage.setItem("token", token);

      // fetch user info from check endpoint and set context so UI updates immediately
      if (setuser) {
        try {
          const { data: checkData } = await axios.get("/users/check", {
            headers: { Authorization: "Bearer " + token },
          });

          // check endpoint returns { msg, username, userid }
          setuser({ username: checkData.username, userid: checkData.userid });
        } catch (err) {
          console.log("failed to fetch user after login", err?.response || err);
        }
      }

      navigate("/home", { replace: true });
    } catch (error) {
      const serverMsg = error?.response?.data?.msg;
      alert(serverMsg || "something went wrong");
      console.log(error.response || error);
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

      <p className="text-center mb-4">
        Don't have an account?
        {onSwitch ? (
          <button
            type="button"
            onClick={onSwitch}
            className="text-orange-500 ml-1"
          >
            Create account
          </button>
        ) : (
          <Link className="text-orange-500 ml-1" to="/register">
            Create account
          </Link>
        )}
      </p>

      <form onSubmit={handlesubmit} className="space-y-4">
        <input
          ref={emailDom}
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
        />

        <input
          ref={passwordDom}
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
