const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library"); // Importando o cliente do Google
const prisma = new PrismaClient();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Substitua com seu CLIENT_ID do Google

// Função de registro de usuário
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verificar se o usuário já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o novo usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

// Função de login de usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Comparar a senha fornecida com a criptografada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Gerar o token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Defina o tempo de expiração
    });

    // Retornar o token e o userId na resposta
    res.json({
      userId: user.id, // Adicionando o userId à resposta
      token: token, // Retornando também o token
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login" });
  }
};

// Função de login com Google
const googleLogin = async (req, res) => {
  console.log("Rota /users/google-login chamada");
  console.log("Headers da requisição:", req.headers);
  console.log("Corpo da requisição:", req.body);
  const { token } = req.body;
  console.log("Token recebido:", token);
  try {
    console.log("Iniciando verificação do token do Google");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("Verificação do token bem-sucedida");
    const payload = ticket.getPayload();
    console.log("Payload do Google:", payload);
    const { sub, email, name, picture } = payload;
    console.log("Dados extraídos do payload:", { sub, email, name, picture });

    console.log("Verificando se o usuário já existe");
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("Usuário não encontrado, criando novo usuário");
      user = await prisma.user.create({
        data: {
          googleId: sub,
          email,
          name,
          picture,
        },
      });
      console.log("Novo usuário criado:", user);
    } else {
      console.log("Usuário encontrado:", user);
    }

    console.log("Gerando JWT");
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("JWT gerado:", jwtToken);

    console.log("Enviando resposta");
    res.status(200).json({
      userId: user.id,
      token: jwtToken,
      message: "Login com Google realizado com sucesso",
    });
    console.log("Resposta enviada");
  } catch (error) {
    console.error("Erro no googleLogin:", error);
    console.error("Detalhes do erro:", error.stack || error.message || error);
    res.status(500).send("Erro ao fazer login com o Google.");
  } finally {
    console.log("Finalizando googleLogin");
  }
};

module.exports = { registerUser, loginUser, googleLogin };
