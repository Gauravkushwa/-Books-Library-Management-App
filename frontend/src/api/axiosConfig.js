import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8282/api", // backend base URL
  withCredentials: true,               // send cookies automatically
});

// Optional: Add interceptors for request/response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
