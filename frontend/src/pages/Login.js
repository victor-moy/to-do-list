import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Paper,
  Divider,
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
        background: "radial-gradient(circle at top, #0d1117, #000)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
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
          boxSizing: "border-box",
        }}
      >
        {/* Logo SVG */}
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

        {/* Campos */}
        <TextField
          label="Email"
          variant="filled"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          InputProps={{ style: { backgroundColor: "#0d1117", color: "#fff" } }}
          InputLabelProps={{ style: { color: "#888" } }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#3f8cff",
            color: "#fff",
            "&:hover": { backgroundColor: "#336fd1" },
          }}
          disabled={isLoading || isLoginDisabled}
          onClick={() => handleLogin(email, password)}
        >
          {isLoading ? "Carregando..." : "Login"}
        </Button>

        <Divider sx={{ my: 2, color: "#ccc", fontWeight: 500 }}>ou</Divider>

        <Box mb={2}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setOpenSnackbar("Erro ao autenticar com o Google")}
            useOneTap
            width="100%"
          />
        </Box>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/register")}
          sx={{
            color: "#9c27b0",
            borderColor: "#9c27b0",
            "&:hover": {
              backgroundColor: "rgba(156, 39, 176, 0.1)",
              borderColor: "#ba68c8",
            },
          }}
        >
          Cadastre-se
        </Button>
      </Paper>

      {/* Snackbar de mensagens */}
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
