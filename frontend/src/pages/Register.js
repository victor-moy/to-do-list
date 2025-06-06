import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material";
import useAuth from "../hooks/useAuth"; // Hook de autenticação

const Register = () => {
  // Estados locais para armazenar os dados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Funções e estados vindos do hook de autenticação
  const {
    isLoading,
    openSnackbar,
    snackbarMessage,
    handleRegister,
    setOpenSnackbar,
  } = useAuth();

  // Funções auxiliares para validação dos campos
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  // Função chamada ao clicar em "Cadastrar"
  const registerUser = async () => {
    if (!name.trim())
      return setOpenSnackbar({
        message: "O nome não pode estar vazio!",
        open: true,
      });
    if (!isValidEmail(email))
      return setOpenSnackbar({ message: "Email inválido!", open: true });
    if (!isValidPassword(password))
      return setOpenSnackbar({
        message: "Senha não atende os requisitos!",
        open: true,
      });

    await handleRegister(name, email, password);
  };

  return (
    <Container maxWidth="sm">
      {/* Tela de carregamento enquanto envia dados */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress size={80} color="primary" />
        </Box>
      )}

      {/* Formulário de registro */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 5,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Criar Conta
        </Typography>

        {/* Campo: Nome */}
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />

        {/* Campo: Email com validação */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          error={email && !isValidEmail(email)}
          helperText={email && !isValidEmail(email) ? "Email inválido" : ""}
        />

        {/* Campo: Senha com validação */}
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          error={password && !isValidPassword(password)}
        />
        <FormHelperText sx={{ color: "gray", fontSize: "0.9rem", mb: 2 }}>
          * A senha deve conter pelo menos 8 caracteres, incluindo uma letra
          maiúscula, um número e um caractere especial.
        </FormHelperText>

        {/* Botões de ação */}
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={registerUser}
            sx={{ marginBottom: 2 }}
            disabled={isLoading}
          >
            Cadastrar
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Já tem uma conta? Faça login
          </Button>
        </Box>
      </Box>

      {/* Snackbar para mensagens de feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarMessage.includes("sucesso") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
