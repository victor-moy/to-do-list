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
} from "@mui/material";

const statusColors = {
  ToDo: "default",
  Doing: "primary",
  Done: "success",
};

const SharedTaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
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
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {task.title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" sx={{ mb: 2 }}>
          {task.description || "Sem descrição"}
        </Typography>

        <Box display="flex" gap={2} sx={{ mb: 2 }}>
          <Chip label={`Prioridade: ${task.priority}`} />
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
                  <Link href={file.fileUrl} target="_blank" rel="noopener">
                    {file.originalName || file.fileUrl}
                  </Link>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SharedTaskPage;
