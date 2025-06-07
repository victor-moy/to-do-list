import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import useAuth from "../hooks/useAuth";

const Login = () => {
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
  } = useAuth();

  const isLoginDisabled = !email || !password;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #0d1117 0%, #000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          backgroundColor: "rgba(22, 27, 34, 0.95)",
          backdropFilter: "blur(6px)",
          padding: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        {/* Logo ou SVG */}
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
          sx={{ fontWeight: "bold", color: "#fff" }}
        >
          Tacly
        </Typography>

        <TextField
          label="Email"
          variant="filled"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            style: { backgroundColor: "#0d1117", color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#ccc" },
          }}
        />

        <TextField
          label="Senha"
          type="password"
          variant="filled"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            style: { backgroundColor: "#0d1117", color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#ccc" },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={() => handleLogin(email, password)}
          disabled={isLoading || isLoginDisabled}
          sx={{
            mt: 2,
            backgroundColor: "#3f8cff",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#336fd1" },
          }}
        >
          {isLoading ? "Carregando..." : "Login"}
        </Button>

        {/* Divider */}
        <Divider sx={{ my: 2, color: "#ccc", fontWeight: 500 }}>ou</Divider>

        {/* Login com Google - ocupa 100% */}
        <Box display="flex" justifyContent="center" width="100%" mb={2}>
          <Box width="100%">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setOpenSnackbar("Erro ao autenticar com o Google")}
              useOneTap
              theme="filled_black"
              width="100%" // ❗️isso não faz nada no componente, então usamos o Box
            />
          </Box>
        </Box>

        {/* Botão Cadastre-se estilizado */}
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/register")}
          sx={{
            mt: 2,
            color: "#ffffff",
            borderColor: "#444",
            "&:hover": {
              backgroundColor: "#1e1e1e",
              borderColor: "#888",
            },
          }}
        >
          Cadastre-se
        </Button>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Login;
