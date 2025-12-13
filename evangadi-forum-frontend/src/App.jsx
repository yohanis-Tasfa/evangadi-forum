import { useNavigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState, createContext } from "react";
import axios from "./axios";

export const AppState = createContext();

function App() {
  const [user, setuser] = useState({});

  const token = localStorage.getItem("token"); // get saved token from local strorage
  const navigate = useNavigate();
  async function checkUser() {
    try {
      const { data } = await axios.get("/users/check", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setuser(data);
    } catch (error) {
      console.log(error.respone);
      navigate("/login");
    }
  }
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AppState.Provider value={{ user, setuser }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AppState.Provider>
  );
}

export default App;
