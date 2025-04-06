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
        await prisma.attachment.create({
          data: {
            filePath: file.path, // Caminho do arquivo armazenado
            taskId: task.id, // Associando o arquivo à tarefa criada
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
        await prisma.attachment.create({
          data: {
            filePath: file.path,
            taskId: updatedTask.id,
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

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask, // Adicione a função deleteTask aqui
};
