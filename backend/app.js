const express = require("express");
const cors = require("cors");
const path = require("path");

// Importação das rotas
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Middleware para servir arquivos estáticos (ex: anexos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware de CORS: permite que outras aplicações (como o frontend) façam requisições
app.use(
  cors({
    origin: "*", // ⚠️ Em produção, prefira restringir para domínios específicos
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Rotas principais do projeto
app.use("/users", userRoutes); // Rotas de autenticação (registro, login, Google login)
app.use("/tasks", taskRoutes); // Rotas de tarefas (CRUD + anexos)

module.exports = app;
