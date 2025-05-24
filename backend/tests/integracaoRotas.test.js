const request = require("supertest");
const app = require("../app"); // Certifique-se de estar importando o app e não o server.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let taskId = null;

beforeAll(async () => {
  await prisma.user.create({
    data: {
      id: "test-user",
      name: "Usuário Teste",
      email: `test${Date.now()}@teste.com`,
      password: "senha123",
    },
  });
});

afterAll(async () => {
  await prisma.attachment.deleteMany();
  await prisma.task.deleteMany({ where: { userId: "test-user" } });
  await prisma.user.deleteMany({ where: { id: "test-user" } });
  await prisma.$disconnect();
});

describe("Integração completa entre rotas", () => {
  it("Deve criar uma tarefa com sucesso", async () => {
    const res = await request(app)
      .post("/tasks")
      .field("title", "Tarefa integração")
      .field("userId", "test-user")
      .field("status", "ToDo")
      .field("description", "Descrição inicial")
      .field("priority", "Medium");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    taskId = res.body.id;
  });

  it("Deve buscar as tarefas do usuário", async () => {
    const res = await request(app).get("/tasks/test-user");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Deve atualizar a tarefa criada", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .field("title", "Tarefa atualizada")
      .field("userId", "test-user")
      .field("status", "Doing")
      .field("description", "Atualizada via teste")
      .field("priority", "High");

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Tarefa atualizada");
  });

  it("Deve buscar tarefa compartilhada", async () => {
    const res = await request(app).get(`/tasks/shared/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("attachments");
  });

  it("Deve deletar a tarefa", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/sucesso/i);
  });
});
