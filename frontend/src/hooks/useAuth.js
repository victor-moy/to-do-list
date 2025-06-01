import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Hook personalizado para autenticação de usuários (login, Google login e registro).
 * Controla carregamento, navegação, feedback por snackbar e persistência de token.
 */
const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false); // Indica estado de carregamento
  const [openSnackbar, setOpenSnackbar] = useState(false); // Controle de visibilidade do snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensagem exibida no snackbar
  const navigate = useNavigate(); // Para redirecionar após login/cadastro

  // Abre o snackbar com mensagem e tipo (erro, sucesso, etc.)
  const handleSnackbarOpen = (message, severity = "error") => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
    // Obs: `severity` pode ser usado no componente que exibe o Snackbar
  };

  // Login tradicional (email/senha)
  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/users/login", { email, password });
      if (data.userId && data.token) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);
        navigate("/tasks");
      } else {
        handleSnackbarOpen("Erro: dados de login incompletos.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      handleSnackbarOpen("Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  // Login com conta Google
  const handleGoogleLoginSuccess = async (response) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/users/google-login", {
        token: response.credential,
      });
      if (data.userId && data.token) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);
        navigate("/tasks");
      } else {
        handleSnackbarOpen("Erro ao fazer login com o Google.");
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      handleSnackbarOpen("Erro ao autenticar com o Google.");
    } finally {
      setIsLoading(false);
    }
  };

  // Registro de novo usuário
  const handleRegister = async (name, email, password) => {
    setIsLoading(true);
    try {
      await api.post("/users/register", { name, email, password });
      handleSnackbarOpen("Cadastro realizado com sucesso!", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Erro no registro:", error);
      handleSnackbarOpen("Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Valores e funções expostas pelo hook
  return {
    isLoading,
    openSnackbar,
    snackbarMessage,
    handleLogin,
    handleGoogleLoginSuccess,
    handleRegister,
    setOpenSnackbar,
  };
};

export default useAuth;
