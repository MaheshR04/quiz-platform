import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach token to every request
API.interceptors.request.use(
  (req) => {

    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;

  },
  (error) => {
    return Promise.reject(error);
  }
);


// Handle API errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response) {
      console.error("API Error:", error.response.data);

      // Handle token expiration or invalidity (401 Unauthorized)
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect only if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;