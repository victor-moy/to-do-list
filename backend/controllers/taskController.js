const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const prisma = new PrismaClient();
const fs = require("fs");

// Configuração do Multer para o armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(
      /\s+/g,
      "-"
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não permitido"), false);
    }
  },
}).array("files"); // input name no frontend

// Buscar todas as tarefas de um usuário (com anexos)
const getTasks = async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: {
        attachments: true, // ✅ Importante
      },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

// Criar nova tarefa com anexo
const createTask = async (req, res) => {
  const { title, userId, status, description, priority } = req.body;
  const files = req.files;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        userId,
        status: status || "ToDo",
        description: description || "",
        priority: priority || "Medium",
      },
    });

    if (files && files.length > 0) {
      for (const file of files) {
        const fileUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;
        await prisma.attachment.create({
          data: {
            filePath: file.path,
            taskId: task.id,
            fileUrl: fileUrl,
          },
        });
      }
    }

    res.status(201).json(task);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

// Atualizar uma tarefa (e salvar novos anexos, se enviados)
const updateTask = async (req, res) => {
  const { title, description, priority, status, userId } = req.body;
  const { id } = req.params;
  const files = req.files;

  try {
    if (!title || !description || !status || !priority || !userId) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        userId,
      },
    });

    if (files && files.length > 0) {
      for (const file of files) {
        const fileUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;
        await prisma.attachment.create({
          data: {
            filePath: file.path,
            taskId: updatedTask.id, // ✅ Correção
            fileUrl: fileUrl,
          },
        });
      }
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
};

// Excluir tarefa
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id },
    });
    res.json({ message: "Tarefa excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
};

// Obter tarefa compartilhada (com anexos)
const getSharedTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        attachments: true,
      },
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

const deleteAttachment = async (req, res) => {
  const { id } = req.params;
  try {
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment)
      return res.status(404).json({ error: "Anexo não encontrado" });

    // Remove arquivo fisicamente
    fs.unlink(attachment.filePath, (err) => {
      if (err) console.warn("Erro ao remover arquivo do disco:", err);
    });

    // Remove do banco
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
};
