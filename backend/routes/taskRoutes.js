const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
} = require("../controllers/taskController");
const multer = require("multer");

// Configuração do Multer para lidar com o upload de arquivos
const upload = multer({ dest: "uploads/" }); // Define o diretório onde os arquivos serão armazenados

const router = express.Router();

// Rota para pegar tarefas por usuário
router.get("/:userId", getTasks);

// Rota para criar nova tarefa (com suporte para upload de arquivos)
router.post("/", upload.array("files"), createTask); // Usando 'upload.array("files")' para permitir múltiplos arquivos

// Rota para atualizar tarefa (agora com o nome de parâmetro "id" em vez de "taskId")
router.put("/:id", upload.array("files"), updateTask); // Usando 'upload.array("files")' também aqui para permitir anexos na atualização

module.exports = router;
