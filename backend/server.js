require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Rota para testar a API
app.get("/", (req, res) => {
  res.send("API funcionando!");
});

// Usar as rotas separadas
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
