import { useRef } from "react"; // used to catch userinput
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const emailDom = useRef();
  const passwordDom = useRef();

  async function handlesubmit(e) {
    e.preventDefault();
    // console.log(emailDom.current.value);// to see the input field value

    // check if all requiered field provide

    const emailValue = emailDom.current.value;
    const passwordValue = passwordDom.current.value;

    if (!emailValue || !passwordValue) {
      alert("please provide all requiered information");
      return;
    }

    // send request by axios
    try {
      const { data } = await axios.post("/users/login", {
        email: emailValue,
        password: passwordValue,
      });
      alert("loggedin successfully.");
      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (error) {
      alert("something went wrong");
      console.log(error.response);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handlesubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">login</h2>
        <h2 className="text-xl font-semibold text-center mb-4">
          Don't have an account?
          <Link className="text-orange-500 ml-1" to={"/register"}>
            create account
          </Link>
        </h2>

        <div>
          <input
            ref={emailDom}
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        <div>
          <input
            ref={passwordDom}
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          login
        </button>
      </form>
    </section>
  );
}

export default Login;
