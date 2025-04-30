import { getStoredTokens } from "@/services/auth";
import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    // ...(localStorage.getItem("x-branch-id") && {
    //   "x-branch-id": localStorage.getItem("x-branch-id"),
    // }),
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const companyDomain = localStorage.getItem("company_domain");
    config.baseURL =
      "https://" + localStorage.getItem("company_domian") + ".eng-mahmoud.com";

    // config.baseURL = companyDomain
    //   ? `https://${companyDomain}.eng-mahmoud.com`
    //   : "https://default.eng-mahmoud.com";

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
      localStorage.removeItem("company_domain");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
