import axios, {type InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const attachAuthInterceptor = (getToken: () => string | null ) => {
  API.interceptors.request.use(
    (req: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });
};

export default API;
