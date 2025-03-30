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
  const { token } = req.body; // Token do Google enviado do frontend
  try {
    // Verificar o token com o Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Substitua pelo seu Google Client ID
    });

    // Obter os dados do usuário
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Verifique se o usuário já existe no banco
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Se o usuário não existir, crie um novo usuário
      user = await prisma.user.create({
        data: {
          googleId: sub,
          email,
          name,
          picture,
        },
      });
    }

    // Gerar um token JWT para o usuário
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // O token expira em 1 hora, você pode ajustar
    });

    // Retornar o usuário e o token JWT
    res.status(200).json({
      userId: user.id,
      token: jwtToken,
      message: "Login com Google realizado com sucesso",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao fazer login com o Google.");
  }
};

module.exports = { registerUser, loginUser, googleLogin };
