import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";

function Register({ onSwitch }) {
  const navigate = useNavigate();

  const usernameDom = useRef();
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();

  async function handlesubmit(e) {
    e.preventDefault();

    const username = usernameDom.current.value;
    const firstname = firstnameDom.current.value;
    const lastname = lastnameDom.current.value;
    const email = emailDom.current.value;
    const password = passwordDom.current.value;

    if (
      !username ||
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      password.length < 8
    ) {
      alert(
        "Please provide all required fields and password must be at least 8 characters"
      );
      return;
    }

    try {
      await axios.post("/users/register", {
        username,
        firstname,
        lastname,
        email,
        password,
      });

      // alert("Registered successfully. Please login.");
      navigate("/login");

      if (onSwitch) {
        onSwitch();
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Join the network
      </h2>

      <p className="text-center mb-4">
        Already have an account?
        {onSwitch ? (
          <button
            type="button"
            onClick={onSwitch}
            className="text-orange-500 ml-1"
          >
            Sign in
          </button>
        ) : (
          <Link to="/login" className="text-orange-500 ml-1">
            Sign in
          </Link>
        )}
      </p>

      <form onSubmit={handlesubmit} className="space-y-4">
        <input
          ref={emailDom}
          type="email"
          placeholder="Email"
          className="w-full border rounded-md px-4 py-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            ref={firstnameDom}
            type="text"
            placeholder="First Name"
            className="border rounded-md px-4 py-3"
          />
          <input
            ref={lastnameDom}
            type="text"
            placeholder="Last Name"
            className="border rounded-md px-4 py-3"
          />
        </div>

        <input
          ref={usernameDom}
          type="text"
          placeholder="User Name"
          className="w-full border rounded-md px-4 py-3"
        />

        <input
          ref={passwordDom}
          type="password"
          placeholder="Password"
          className="w-full border rounded-md px-4 py-3"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
