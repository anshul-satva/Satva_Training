import axios from "axios";

const shouldLogApi = () =>
  import.meta.env.DEV && localStorage.getItem("debugApiLogs") === "true";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (shouldLogApi()) {
    console.log(
      `[API Request]: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object") {
      if (response.data.data === undefined && response.data.result !== undefined) {
        Object.defineProperty(response.data, "data", {
          value: response.data.result,
          enumerable: false,
          configurable: true,
          writable: true,
        });
      }

      if (
        response.data.url === undefined &&
        response.data.result &&
        typeof response.data.result === "object" &&
        "url" in response.data.result
      ) {
        Object.defineProperty(response.data, "url", {
          value: response.data.result.url,
          enumerable: false,
          configurable: true,
          writable: true,
        });
      }
    }

    if (shouldLogApi()) {
      const safeResponse =
        response.data && typeof response.data === "object"
          ? {
              responseStatus: response.data.responseStatus,
              message: response.data.message,
              result: response.data.result,
            }
          : response.data;

      console.log(`[API Response]: ${response.config.url}`, safeResponse);
    }

    return response;
  },
  (error) => {
    if (shouldLogApi()) {
      console.error(`[API Error]: ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

export default api;
