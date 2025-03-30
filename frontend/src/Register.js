import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
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

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Validação de email e senha
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  // Função de registro
  const register = async () => {
    if (!name.trim()) return showMessage("O nome não pode estar vazio!");
    if (!isValidEmail(email)) return showMessage("Email inválido!");
    if (!isValidPassword(password))
      return showMessage("Senha não atende os requisitos!");

    try {
      setLoading(true);
      await api.post("/users/register", { name, email, password });
      showMessage("Cadastro realizado com sucesso!", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      showMessage("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Exibe mensagens de erro ou sucesso
  const showMessage = (message, severity = "error") => {
    setErrorMessage(message);
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="sm">
      {loading && (
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

        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          error={email && !isValidEmail(email)}
          helperText={email && !isValidEmail(email) ? "Email inválido" : ""}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          error={password && !isValidPassword(password)}
        />

        <FormHelperText sx={{ color: "gray", fontSize: "0.9rem", mb: 2 }}>
          * A senha deve conter pelo menos 8 caracteres, incluindo uma letra
          maiúscula, um número e um caractere especial.
        </FormHelperText>

        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={register}
            sx={{ marginBottom: 2 }}
            disabled={loading}
          >
            Cadastrar
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Já tem uma conta? Faça login
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={errorMessage.includes("sucesso") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;
