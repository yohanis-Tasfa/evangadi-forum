import { useRef } from "react"; // used to catch userinput
import axios from "../axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  // catch user input
  const usernameDom = useRef();
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();

  async function handlesubmit(e) {
    e.preventDefault();
    // console.log(usernameDom.current.value);// to see the input field value

    // check if all requiered field provide

    const usernameValue = usernameDom.current.value;
    const firstnameValue = firstnameDom.current.value;
    const lastnameValue = lastnameDom.current.value;
    const emailValue = emailDom.current.value;
    const passwordValue = passwordDom.current.value;

    if (
      !usernameValue ||
      !firstnameValue ||
      !lastnameValue ||
      !emailValue ||
      !passwordValue
    ) {
      alert("please provide all requiered information");
      return;
    }

    // send request by axios
    try {
      await axios.post("/users/register", {
        username: usernameValue,
        firstname: firstnameValue,
        lastaname: lastnameValue,
        email: emailValue,
        password: passwordValue,
      });
      alert("registered successfully. please login");
      navigate("/login");
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
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        <div>
          <input
            ref={usernameDom}
            type="text"
            name="username"
            placeholder="Enter username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        <div>
          <input
            ref={firstnameDom}
            type="text"
            name="firstname"
            placeholder="First name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        <div>
          <input
            ref={lastnameDom}
            type="text"
            name="lastname"
            placeholder="Last name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

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
          Register
        </button>
      </form>
    </section>
  );
}

export default Register;
