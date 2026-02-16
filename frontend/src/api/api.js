import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const attachAuthInterceptor = (getToken) => {
  API.interceptors.request.use((req) => {
    const token = getToken();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });
};

export default API;
