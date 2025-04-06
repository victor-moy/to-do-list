import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import api from "./services/api";
import { Chip } from "@mui/material";
import { Input } from "@mui/material"; // Adicionar isso à sua importação

const statusLabels = {
  ToDo: "To Do",
  Doing: "Em Progresso",
  Done: "Concluído",
};

function TaskList() {
  // Aqui você já tem outros estados, então adicione estes logo após
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ToDo");
  const [priority, setPriority] = useState("Medium");
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [files, setFiles] = useState([]); // Adicionando o estado para os arquivos
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    const { data } = await api.get(`/tasks/${userId}`);
    setTasks(data);
  };

  // Função para lidar com a alteração do arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Pegando o primeiro arquivo selecionado

    if (file) {
      setFiles((prevFiles) => [...prevFiles, file]); // Adicionando o arquivo ao estado
    }
  };

  const addTask = async () => {
    if (title && userId) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("priority", priority);
      formData.append("userId", userId);

      // Adicionando os arquivos
      files.forEach((file, index) => {
        formData.append("files", file); // 'files' é o nome que o Multer espera no backend
      });

      try {
        await api.post("/tasks", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Necessário para enviar arquivos
          },
        });
        fetchTasks();
        setTitle("");
        setDescription("");
        setStatus("ToDo");
        setPriority("Medium");
        setFiles([]); // Limpar os arquivos após o envio
      } catch (error) {
        console.error("Erro ao adicionar tarefa com anexo", error);
      }
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      const { title, description, priority, userId } = taskToUpdate;

      await api.put(`/tasks/${taskId}`, {
        title,
        description,
        status: newStatus,
        priority,
        userId,
      });

      fetchTasks();
    }
  };

  const updateTaskDetails = async () => {
    if (selectedTask) {
      const updatedData = {
        title: editTitle,
        description: editDescription,
        priority: editPriority || selectedTask.priority,
        status: selectedTask.status,
        userId: selectedTask.userId,
      };

      try {
        await api.put(`/tasks/${selectedTask.id}`, updatedData);
        fetchTasks();
        setSelectedTask(null);
      } catch (error) {
        console.error("Erro ao atualizar tarefa", error);
      }
    }
  };

  const reorderTasks = (status, fromId, toId) => {
    const updated = [...tasks];
    const filtered = updated.filter((t) => t.status === status);
    const fromIndex = filtered.findIndex((t) => t.id === fromId);
    const toIndex = filtered.findIndex((t) => t.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;

    const item = filtered[fromIndex];
    filtered.splice(fromIndex, 1);
    filtered.splice(toIndex, 0, item);

    const reordered = [
      ...updated.filter((t) => t.status !== status),
      ...filtered,
    ];
    setTasks(reordered);
  };

  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  const handleDropColumn = (e, newStatus) => {
    e.preventDefault();
    if (draggedTaskId) {
      const task = tasks.find((t) => t.id === draggedTaskId);
      if (task && task.status !== newStatus) {
        updateTaskStatus(draggedTaskId, newStatus);
      }
      setDraggedTaskId(null);
    }
  };

  const handleDropOnItem = (e, targetTask) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetTask.id) return;

    const draggedTask = tasks.find((t) => t.id === draggedTaskId);
    if (draggedTask.status === targetTask.status) {
      reorderTasks(targetTask.status, draggedTaskId, targetTask.id);
    } else {
      updateTaskStatus(draggedTaskId, targetTask.status);
    }
    setDraggedTaskId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditTitle(task.title); // Setando o título atual da tarefa para edição
    setEditDescription(task.description || ""); // Setando a descrição atual da tarefa
  };

  const renderTasksByStatus = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <ListItem
          key={task.id}
          draggable
          onClick={() => handleTaskClick(task)}
          onDragStart={() => handleDragStart(task.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnItem(e, task)}
          sx={{
            pb: 1,
            backgroundColor: "#fff",
            borderRadius: "4px",
            marginBottom: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {task.title}
          </Typography>

          {/* Adicionando a etiqueta de prioridade abaixo do título */}
          <Chip
            label={task.priority} // Mostra a prioridade da tarefa
            color={
              task.priority === "High"
                ? "error"
                : task.priority === "Medium"
                ? "warning"
                : "success"
            } // Cores diferentes para as prioridades
            sx={{ mt: 1 }} // Adiciona um pequeno espaço acima da etiqueta
          />
        </ListItem>
      ));
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          padding: 3,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Lista de Tarefas
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Título da Tarefa"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 1 }}
          />

          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            multiline
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 1 }}
          />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="ToDo">To Do</MenuItem>
                  <MenuItem value="Doing">Em Progresso</MenuItem>
                  <MenuItem value="Done">Concluído</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={priority}
                  label="Prioridade"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="Low">Baixa</MenuItem>
                  <MenuItem value="Medium">Média</MenuItem>
                  <MenuItem value="High">Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Adicionar Anexo</InputLabel>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e)}
                  inputProps={{ accept: "image/*, .pdf, .docx, .txt" }} // Tipos de arquivo permitidos
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" onClick={addTask}>
            Adicionar Tarefa
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ flexGrow: 1, height: "100%" }}>
          {["ToDo", "Doing", "Done"].map((status) => (
            <Grid
              key={status}
              item
              xs={4}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropColumn(e, status)}
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box
                sx={{
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                  padding: 2,
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  minHeight: 0,
                }}
              >
                <Typography variant="h6" align="center" gutterBottom>
                  {statusLabels[status]}
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "#f0f0f0",
                    padding: 1,
                    borderRadius: "8px",
                    overflowY: "auto",
                    minHeight: "100px",
                  }}
                >
                  <List sx={{ padding: 0 }}>{renderTasksByStatus(status)}</List>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal de edição */}
      <Dialog
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent>
          <TextField
            label="Título"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)} // Atualiza o título conforme o usuário digita
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label="Descrição"
            fullWidth
            multiline
            minRows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)} // Atualiza a descrição conforme o usuário digita
          />

          {/* Adicionando o campo de prioridade */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Prioridade</InputLabel>
            <Select
              value={editPriority || selectedTask?.priority} // Definindo a prioridade inicial
              label="Prioridade"
              onChange={(e) => setEditPriority(e.target.value)} // Atualiza a prioridade conforme o usuário escolhe
            >
              <MenuItem value="Low">Baixa</MenuItem>
              <MenuItem value="Medium">Média</MenuItem>
              <MenuItem value="High">Alta</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedTask(null)}>Cancelar</Button>
          <Button onClick={updateTaskDetails} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TaskList;
