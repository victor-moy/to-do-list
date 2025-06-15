const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  getSharedTask,
  deleteTask,
  deleteAttachment,
  upload, // IMPORTANTE: upload vem do controller!
} = require("../controllers/taskController");

const router = express.Router();

/**
 * GET /:userId
 * Retorna todas as tarefas de um usuário
 */
router.get("/:userId", getTasks);

/**
 * POST /
 * Cria nova tarefa (pode conter arquivos anexos)
 */
router.post("/", upload, createTask); // usa upload do controller

/**
 * PUT /:id
 * Atualiza tarefa existente e permite anexar novos arquivos
 */
router.put("/:id", upload, updateTask); // usa upload do controller

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
