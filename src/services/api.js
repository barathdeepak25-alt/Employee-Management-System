import axios from "axios";

// One shared Axios instance with the backend base URL
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Before every request: attach the token if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// After every response: if the token is rejected, force logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginCall) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper: pull a readable message out of any Axios error
export const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

export default api;
