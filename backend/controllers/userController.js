const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const prisma = new PrismaClient();

// Cliente OAuth do Google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Registra um novo usuário no sistema
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

/**
 * Realiza login tradicional com email e senha
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT_SECRET não configurado" });
    }

    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: "1h",
    });

    res.json({ userId: user.id, token });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro ao realizar login" });
  }
};

/**
 * Realiza login com conta do Google
 */
const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: sub,
          email,
          name,
          picture,
        },
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT_SECRET não configurado" });
    }

    const jwtToken = jwt.sign({ userId: user.id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({
      userId: user.id,
      token: jwtToken,
      message: "Login com Google realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro no googleLogin:", error);
    res.status(500).send("Erro ao fazer login com o Google.");
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
};
