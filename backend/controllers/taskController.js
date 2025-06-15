const { PrismaClient } = require("@prisma/client");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");
const multer = require("multer");

// Instância do Prisma
const prisma = new PrismaClient();

/**
 * Configuração de upload de arquivos via multer
 * - Armazena em /uploads
 * - Limita a 10MB
 * - Aceita apenas tipos permitidos
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tacly",
    resource_type: "auto",
  },
});

const upload = multer({ storage }).array("files");

// Retorna todas as tarefas de um usuário (com anexos incluídos)
const getTasks = async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: { attachments: true },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

// Cria uma nova tarefa e salva arquivos, se houver
const createTask = async (req, res) => {
  const {
    title,
    userId,
    status = "ToDo",
    description = "",
    priority = "Medium",
  } = req.body;
  const files = req.files;

  try {
    const task = await prisma.task.create({
      data: { title, userId, status, description, priority },
    });

    // Salva anexos no banco, se houver arquivos
    if (files?.length) {
      await Promise.all(
        files.map((file) =>
          prisma.attachment.create({
            data: {
              fileUrl: file.path, // ainda retorna a URL final
              filePath: file.filename, // salva o nome no cloud, opcional
              taskId: task.id,
            },
          })
        )
      );
    }

    res.status(201).json(task);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

// Atualiza dados da tarefa e adiciona novos anexos se houver
const updateTask = async (req, res) => {
  const { title, description, priority, status, userId } = req.body;
  const { id } = req.params;
  const files = req.files;

  if (!title || !description || !status || !priority || !userId) {
    return res
      .status(400)
      .json({ error: "Todos os campos devem ser preenchidos" });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, priority, status, userId },
    });

    if (files?.length) {
      await Promise.all(
        files.map((file) =>
          prisma.attachment.create({
            data: {
              fileUrl: file.path, // ainda retorna a URL final
              filePath: file.filename, // salva o nome no cloud, opcional
              taskId: updatedTask.id,
            },
          })
        )
      );
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
};

// Exclui uma tarefa pelo ID
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Tarefa excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
};

// Retorna uma tarefa compartilhada com seus anexos
const getSharedTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { attachments: true },
    });

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    const { title, description, status, priority, createdAt, attachments } =
      task;
    res.json({ title, description, status, priority, createdAt, attachments });
  } catch (error) {
    console.error("Erro ao buscar tarefa compartilhada:", error);
    res.status(500).json({ error: "Erro ao buscar tarefa compartilhada" });
  }
};

// Remove anexo tanto do disco quanto do banco
const deleteAttachment = async (req, res) => {
  const { id } = req.params;

  try {
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment) {
      return res.status(404).json({ error: "Anexo não encontrado" });
    }

    await prisma.attachment.delete({ where: { id } });

    res.json({ message: "Anexo removido com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir anexo:", error);
    res.status(500).json({ error: "Erro ao excluir anexo" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  getSharedTask,
  deleteTask,
  deleteAttachment,
  upload, // exporta o middleware de upload
};
