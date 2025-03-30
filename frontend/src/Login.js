import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para controlar o Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensagem do Snackbar
  const navigate = useNavigate();

  // Função para abrir o Snackbar com a mensagem
  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // Função de login
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/users/login", { email, password });
      setIsLoading(false);

      if (data.userId && data.token) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);
        navigate("/tasks");
      } else {
        handleSnackbarOpen("Erro: dados de login incompletos.");
      }
    } catch (error) {
      setIsLoading(false);
      handleSnackbarOpen("Erro ao fazer login");
    }
  };

  // Função de login com Google
  const handleGoogleLoginSuccess = async (response) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/users/google-login", {
        token: response.credential,
      });
      setIsLoading(false);

      if (data.userId && data.token) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);
        navigate("/tasks");
      } else {
        handleSnackbarOpen("Erro ao fazer login com o Google.");
      }
    } catch (error) {
      setIsLoading(false);
      handleSnackbarOpen("Erro ao autenticar com o Google.");
    }
  };

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
            onClick={handleLogin}
            disabled={isLoading || isLoginDisabled} // Desabilita o botão se email ou senha estiverem vazios
          >
            {isLoading ? "Carregando..." : "Login"}
          </Button>

          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() =>
              handleSnackbarOpen("Erro ao autenticar com o Google")
            }
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
