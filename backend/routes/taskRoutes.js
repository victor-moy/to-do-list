const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  getSharedTask,
  deleteTask,
  deleteAttachment,
} = require("../controllers/taskController");
const multer = require("multer");

const router = express.Router();

// ⚙️ Configuração do multer (upload básico para arquivos)
const upload = multer({ dest: "uploads/" });

/**
 * GET /:userId
 * Retorna todas as tarefas de um usuário
 */
router.get("/:userId", getTasks);

/**
 * POST /
 * Cria nova tarefa (pode conter arquivos anexos)
 */
router.post("/", upload.array("files"), createTask);

/**
 * PUT /:id
 * Atualiza tarefa existente e permite anexar novos arquivos
 */
router.put("/:id", upload.array("files"), updateTask);

/**
 * DELETE /:id
 * Remove uma tarefa completamente
 */
router.delete("/:id", deleteTask);

/**
 * GET /shared/:id
 * Recupera os dados de uma tarefa compartilhada com anexos
 */
router.get("/shared/:id", getSharedTask);

/**
 * DELETE /attachment/:id
 * Exclui um anexo de uma tarefa
 */
router.delete("/attachment/:id", deleteAttachment);

module.exports = router;
