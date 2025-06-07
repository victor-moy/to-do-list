import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Link,
  Paper,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const statusColors = {
  ToDo: "secondary", // Roxo (visualmente forte no escuro)
  Doing: "primary",
  Done: "success",
};

const SharedTaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get(`/tasks/shared/${id}`);
        setTask(data);
      } catch (error) {
        console.error("Erro ao carregar tarefa compartilhada", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <Box
        sx={{
          background: "radial-gradient(circle at top, #0d1117, #000)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return (
      <Container>
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          Tarefa não encontrada.
        </Typography>
      </Container>
    );
  }

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
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 4,
          maxWidth: 500,
          width: "100%",
          backgroundColor: "#161b22",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Logo Tacly */}
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

        {/* Botão copiar */}
        <Box position="absolute" top={16} right={16}>
          <Tooltip title={copied ? "Link copiado!" : "Copiar link"}>
            <IconButton
              size="small"
              onClick={handleCopyLink}
              sx={{ color: "#aaa" }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {task.title}
        </Typography>

        <Divider sx={{ my: 2, backgroundColor: "#2e3b4e" }} />

        <Typography variant="body1" sx={{ mb: 2 }}>
          {task.description || "Sem descrição"}
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip
            label={`Prioridade: ${task.priority}`}
            color="info"
            variant="filled"
          />
          <Chip
            label={`Status: ${task.status}`}
            color={statusColors[task.status] || "default"}
          />
        </Box>

        <Typography variant="caption" color="text.secondary">
          Criada em: {new Date(task.createdAt).toLocaleDateString()}
        </Typography>

        {task.attachments?.length > 0 && (
          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
              Anexos
            </Typography>
            <ul>
              {task.attachments.map((file, index) => (
                <li key={index}>
                  <Link
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="#90caf9"
                  >
                    {file.originalName || file.fileUrl.split("/").pop()}
                  </Link>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SharedTaskPage;
