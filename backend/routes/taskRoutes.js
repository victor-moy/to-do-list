const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  getSharedTask,
  deleteTask, // Importe a função deleteTask do seu controller
} = require("../controllers/taskController");
const multer = require("multer");

// Configuração do Multer (se você precisar dele para a exclusão, o que é improvável)
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Rota para pegar tarefas por usuário
router.get("/:userId", getTasks);

// Rota para criar nova tarefa (com suporte para upload de arquivos)
router.post("/", upload.array("files"), createTask);

// Rota para atualizar tarefa
router.put("/:id", upload.array("files"), updateTask);

// Rota para deletar tarefa
router.delete("/:id", deleteTask);

router.get("/shared/:id", getSharedTask);

module.exports = router;
