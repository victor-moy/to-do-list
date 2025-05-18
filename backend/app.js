// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware para aceitar JSON
app.use(express.json());

// Configuração de CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Rotas
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

module.exports = app;
