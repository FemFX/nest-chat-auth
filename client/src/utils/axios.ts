"ues client";
import axios from "axios";

export const $api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:4000",
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});
$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error: any) => {
    console.log("err");

    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;

      const response = await axios.post(`http://localhost:4000/auth/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.accessToken);
      return $api.request(originalRequest);
    }
    throw error;
  }
);
