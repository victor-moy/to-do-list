const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTasks = async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: userId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

const createTask = async (req, res) => {
  const { title, userId } = req.body;
  try {
    const task = await prisma.task.create({
      data: { title, userId },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

module.exports = { getTasks, createTask };
