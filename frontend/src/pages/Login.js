import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import useAuth from "../hooks/useAuth"; // Hook personalizado de autenticação

const Login = () => {
  // Estados locais para armazenar email e senha
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Funções e variáveis do hook de autenticação
  const {
    isLoading,
    openSnackbar,
    snackbarMessage,
    handleLogin,
    handleGoogleLoginSuccess,
    setOpenSnackbar,
  } = useAuth();

  // Condição para desabilitar o botão se campos estiverem vazios
  const isLoginDisabled = !email || !password;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 5,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Autenticação
        </Typography>

        {/* Campo de email */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Campo de senha */}
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Botão de login tradicional */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLogin(email, password)}
            disabled={isLoading || isLoginDisabled}
          >
            {isLoading ? "Carregando..." : "Login"}
          </Button>

          {/* Login com Google */}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setOpenSnackbar("Erro ao autenticar com o Google")}
            useOneTap
          />

          {/* Redireciona para página de registro */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/register")}
          >
            Cadastre-se
          </Button>
        </Box>
      </Box>

      {/* Snackbar para mensagens de erro ou sucesso */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Login;
