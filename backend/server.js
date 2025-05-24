// server.js
const app = require("./app");
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

setInterval(() => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`🧠 Memória usada: ${used.toFixed(2)} MB`);
}, 5000);
