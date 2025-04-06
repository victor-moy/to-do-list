import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Certifique-se de que o caminho para api.js está correto

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleSnackbarOpen = (message, severity = "error") => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleLogin = async (email, password) => {
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
      console.error("Erro no login:", error); // Log o erro para depuração
    }
  };

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
      console.error("Erro no login com Google:", error); // Log o erro para depuração
    }
  };

  const handleRegister = async (name, email, password) => {
    setIsLoading(true);
    try {
      await api.post("/users/register", { name, email, password });
      handleSnackbarOpen("Cadastro realizado com sucesso!", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setIsLoading(false);
      handleSnackbarOpen("Erro ao cadastrar. Tente novamente.");
      console.error("Erro no registro:", error); // Log o erro para depuração
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    openSnackbar,
    snackbarMessage,
    handleLogin,
    handleGoogleLoginSuccess,
    handleRegister,
    setOpenSnackbar, // Exponha setOpenSnackbar para permitir que os componentes fechem o Snackbar
  };
};

export default useAuth;
