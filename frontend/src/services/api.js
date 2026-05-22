import axios from "axios";

const api = axios.create({
  baseURL: "https://sistema-entregas-production.up.railway.app/api",
});

export default api;