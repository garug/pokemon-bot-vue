import { userStorage } from "@/storage";
import axios, { AxiosRequestConfig } from "axios";

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers = {
    ...userStorage().getHeaders(),
  };
  return config;
});
