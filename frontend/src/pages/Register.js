import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText,
  Paper,
} from "@mui/material";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const {
    isLoading,
    openSnackbar,
    snackbarMessage,
    handleRegister,
    setOpenSnackbar,
  } = useAuth();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

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
    <Box
      sx={{
        background: "radial-gradient(circle at top, #0d1117, #000)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          backgroundColor: "#161b22",
          color: "#ffffff",
        }}
      >
        {/* Logo */}
        <Box display="flex" justifyContent="center" mb={2}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="100" fill="#3F8CFF" />
            <path
              d="M60 105L90 135L140 75"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Tacly
        </Typography>

        {/* Form Fields */}
        <TextField
          label="Nome"
          variant="filled"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{ style: { backgroundColor: "#0d1117", color: "#fff" } }}
          InputLabelProps={{ style: { color: "#888" } }}
        />
        <TextField
          label="Email"
          variant="filled"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email && !isValidEmail(email)}
          helperText={email && !isValidEmail(email) ? "Email inválido" : ""}
          InputProps={{ style: { backgroundColor: "#0d1117", color: "#fff" } }}
          InputLabelProps={{ style: { color: "#888" } }}
        />
        <TextField
          label="Senha"
          type="password"
          variant="filled"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={password && !isValidPassword(password)}
          InputProps={{ style: { backgroundColor: "#0d1117", color: "#fff" } }}
          InputLabelProps={{ style: { color: "#888" } }}
        />
        <FormHelperText sx={{ color: "#aaa", fontSize: "0.85rem", mb: 2 }}>
          * Mínimo 8 caracteres, com letra maiúscula, número e símbolo
        </FormHelperText>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#3f8cff",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#336fd1",
            },
          }}
          onClick={registerUser}
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Cadastrar"}
        </Button>

        <Button
          variant="text"
          fullWidth
          onClick={() => navigate("/")}
          sx={{
            mt: 1,
            color: "#aaa",
            textDecoration: "underline",
            "&:hover": {
              color: "#fff",
            },
          }}
        >
          Já tem conta? Faça login
        </Button>
      </Paper>

      {/* Feedback */}
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
    </Box>
  );
};

export default Register;
