import axios from "axios";

const api = axios.create({
  baseURL: "https://sistema-entregas-8g18.onrender.com/api",
});

export default api;