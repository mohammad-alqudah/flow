import { getStoredTokens } from "@/services/auth";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
  headers: {
    "Content-Type": "application/json",
    // ...(localStorage.getItem("x-branch-id") && {
    //   "x-branch-id": localStorage.getItem("x-branch-id"),
    // }),
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredTokens();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error, "errrrrrrrrrrr");
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.data?.code === "token_not_valid") {
      localStorage.removeItem("auth_tokens");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
