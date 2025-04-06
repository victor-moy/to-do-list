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
import useAuth from "../hooks/useAuth"; // Importe o Hook

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {
    isLoading,
    openSnackbar,
    snackbarMessage,
    handleLogin,
    handleGoogleLoginSuccess,
    setOpenSnackbar,
  } = useAuth(); // Use o Hook

  // Função para verificar se o botão de login deve ser desabilitado
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

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLogin(email, password)} // Chame a função do Hook
            disabled={isLoading || isLoginDisabled}
          >
            {isLoading ? "Carregando..." : "Login"}
          </Button>

          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess} // Chame a função do Hook
            onError={() => setOpenSnackbar("Erro ao autenticar com o Google")}
            useOneTap
          />

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/register")}
          >
            Cadastre-se
          </Button>
        </Box>
      </Box>

      {/* Snackbar para mostrar mensagens de erro ou sucesso */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default Login;
