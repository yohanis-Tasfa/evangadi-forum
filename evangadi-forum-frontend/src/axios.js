import axios from "axios";

const axiosbase = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5500/api",
});

export default axiosbase;

