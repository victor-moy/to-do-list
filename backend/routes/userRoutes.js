const express = require("express");
const {
  registerUser,
  loginUser,
  googleLogin,
} = require("../controllers/userController"); // <- Importação do controller (não alterar)

const router = express.Router();

/**
 * POST /users/register
 * Registra um novo usuário com nome, e-mail e senha
 */
router.post("/register", registerUser);

/**
 * POST /users/login
 * Login tradicional usando e-mail e senha
 */
router.post("/login", loginUser);

/**
 * POST /users/google-login
 * Login utilizando autenticação com Google OAuth
 */
router.post("/google-login", googleLogin);

module.exports = router;
