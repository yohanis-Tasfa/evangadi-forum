import axios from "axios";

const axiosbase = axios.create({
  baseURL: "http://localhost:5500/api",
});

export default axiosbase;
