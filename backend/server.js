const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware para aceitar JSON
app.use(express.json());

// Configuração de CORS para permitir requisições do frontend
app.use(
  cors({
    origin: "http://localhost:3000", // libera acesso do frontend local
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Rotas de usuários
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
