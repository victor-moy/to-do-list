import axios from "axios";

const api = axios.create({
  baseURL: "https://to-do-list-production-5257.up.railway.app",
});

export default api;
