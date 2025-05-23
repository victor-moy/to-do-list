const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const prisma = new PrismaClient();

// Configuração do Multer para o armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Pasta onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  },
});

// Inicialização do multer com o limite de 10 MB por arquivo
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10 MB por arquivo
}).array("files"); // "files" será o nome do campo no frontend

// Buscar todas as tarefas de um usuário
const getTasks = async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
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

  // Para tratar os arquivos recebidos
  const files = req.files;

  try {
    // Criação da tarefa no banco de dados
    const task = await prisma.task.create({
      data: {
        title,
        userId,
        status: status || "ToDo",
        description: description || "",
        priority: priority || "Medium",
      },
    });

    // Processando os arquivos, se houver
    if (files && files.length > 0) {
      for (const file of files) {
        const fileUrl = `http://localhost:5001/uploads/${file.filename}`; // Defina a URL pública do arquivo

        await prisma.attachment.create({
          data: {
            filePath: file.path, // Caminho do arquivo armazenado
            taskId: task.id, // Associando o arquivo à tarefa criada
            fileUrl: fileUrl, // A URL pública do arquivo
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

// Atualizar uma tarefa com anexo (se houver alteração nos anexos)
const updateTask = async (req, res) => {
  const { title, description, priority, status, userId } = req.body;
  const { id } = req.params;

  // Para tratar os arquivos recebidos
  const files = req.files;

  try {
    if (!title || !description || !status || !priority || !userId) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    // Atualizando a tarefa no banco de dados
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

    // Processando os arquivos, se houver
    if (files && files.length > 0) {
      for (const file of files) {
        const fileUrl = `http://localhost:5001/uploads/${file.filename}`; // Defina a URL pública do arquivo

        await prisma.attachment.create({
          data: {
            filePath: file.path, // Caminho do arquivo armazenado
            taskId: task.id, // Associando o arquivo à tarefa criada
            fileUrl: fileUrl, // A URL pública do arquivo
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

// Excluir uma tarefa
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

// Obter tarefa compartilhada
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

    // Retorna somente dados necessários
    const { title, description, status, priority, createdAt, attachments } =
      task;

    res.json({ title, description, status, priority, createdAt, attachments });
  } catch (error) {
    console.error("Erro ao buscar tarefa compartilhada:", error);
    res.status(500).json({ error: "Erro ao buscar tarefa compartilhada" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  getSharedTask,
  deleteTask, // Adicione a função deleteTask aqui
};
