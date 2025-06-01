// server.js
// Arquivo principal responsável por iniciar o servidor Express

const app = require("./app"); // Importa a configuração do app (rotas, middlewares, etc.)

// Usa a porta definida no ambiente (ideal para produção) ou 5001 como padrão local
const PORT = process.env.PORT || 5001;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
