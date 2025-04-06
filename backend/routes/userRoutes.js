const express = require("express");
const {
  registerUser,
  loginUser,
  googleLogin,
} = require("../controllers/userController"); // <- precisa estar exatamente assim

const router = express.Router();

// Rota para registrar um novo usuário
router.post("/register", registerUser);

// Rota para login de usuário
router.post("/login", loginUser);

// Rota para login com Google (ADICIONE ESTA ROTA)
router.post("/google-login", googleLogin);

module.exports = router;
