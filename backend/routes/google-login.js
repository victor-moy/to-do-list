const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
} = require("./controllers/userController");

// Rota de registro de usuário
router.post("/register", registerUser);

// Rota de login de usuário
router.post("/login", loginUser);

// Rota de login com Google
router.post("/google-login", googleLogin);

module.exports = router;
