
import axios from "axios";
//export const NODE_PATH = process.env.NODE_PATH;

export const axiosInstance = axios.create({
   baseURL: "http://localhost:3400",
  //baseURL: "https://loginbackend.cwmgenai.com"
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);