// axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

// ✅ Add interceptors
api.interceptors.request.use(
  (config) => {
    config.params = config.params || {};
    config.params.appid = "391d07c922bdfeff1fe1a5651d758e50"; // replace with your key
    config.params.units = "metric";
    console.log("➡️ Request:", config.url, config.params);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
