const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let createdTaskId = null; // vamos usar essa variável entre os testes

beforeAll(async () => {
  // Cria usuário de teste
  await prisma.user.create({
    data: {
      id: "user123",
      name: "Usuário Teste",
      email: `teste${Date.now()}@teste.com`,
      password: "senha123",
    },
  });

  // Cria uma tarefa inicial
  const task = await prisma.task.create({
    data: {
      title: "Tarefa inicial",
      userId: "user123",
      status: "ToDo",
      description: "Tarefa para teste de GET",
      priority: "Medium",
    },
  });

  createdTaskId = task.id;
});

afterAll(async () => {
  // Limpa tarefas e usuário de teste
  await prisma.attachment.deleteMany({}); // caso existam anexos
  await prisma.task.deleteMany({ where: { userId: "user123" } });
  await prisma.user.deleteMany({ where: { id: "user123" } });
  await prisma.$disconnect();
});

describe("TaskController API", () => {
  it("GET /tasks/:userId - deve retornar tarefas do usuário", async () => {
    const res = await request(app).get("/tasks/user123");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0].userId).toBe("user123");
  });

  it("POST /tasks - deve criar uma nova tarefa", async () => {
    const res = await request(app)
      .post("/tasks")
      .field("title", "Nova tarefa")
      .field("userId", "user123")
      .field("status", "ToDo")
      .field("description", "Criada via teste")
      .field("priority", "High");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdTaskId = res.body.id;
  });

  it("PUT /tasks/:id - deve atualizar uma tarefa existente", async () => {
    const res = await request(app)
      .put(`/tasks/${createdTaskId}`)
      .field("title", "Tarefa atualizada")
      .field("userId", "user123")
      .field("status", "Doing")
      .field("description", "Atualizada via teste")
      .field("priority", "Low");

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Tarefa atualizada");
  });

  it("GET /tasks/shared/:id - deve retornar tarefa compartilhada", async () => {
    const res = await request(app).get(`/tasks/shared/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("status");
  });

  it("DELETE /tasks/:id - deve deletar a tarefa", async () => {
    const res = await request(app).delete(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/excluída com sucesso/i);
  });
});
