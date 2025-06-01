// api.js
// Configuração central do Axios para chamadas HTTP

import axios from "axios";

// Base URL padrão (produção)
const baseURL = "https://to-do-list-production-5257.up.railway.app";

// const baseURL = "http://localhost:5001";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json", // padrão para envios simples
  },
});

export default api;
