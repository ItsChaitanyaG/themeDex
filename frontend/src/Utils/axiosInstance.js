import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/api/v1",
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
});

export default axiosInstance;
