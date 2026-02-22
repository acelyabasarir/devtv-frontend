import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2012", // backend portun
  withCredentials: true,
  timeout: 15000,
});

// Auth gerektirmeyen endpoint'ler
const PUBLIC_PATHS = ["/login", "/health", "/faciliator"];

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";

    const isPublic = PUBLIC_PATHS.some((p) => url.startsWith(p));

    // SADECE admin endpoint'lerde redirect yap
    if (status === 401 && !isPublic) {
      window.location.href = "/";
    }

    return Promise.reject(err);
  }
);

export default api;