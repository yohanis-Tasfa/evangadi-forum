import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const normalizedBaseUrl = (() => {
  const base = (rawBaseUrl || "http://localhost:5500").replace(/\/+$/, "");
  if (base.endsWith("/api")) return base;
  return `${base}/api`;
})();

const axiosbase = axios.create({
  baseURL: normalizedBaseUrl,
});

export default axiosbase;

