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
} from "@mui/material";
import api from "./services/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const userId = localStorage.getItem("userId");

  // Recuperar tarefas do usuário após login
  useEffect(() => {
    if (userId) {
      const fetchTasks = async () => {
        const { data } = await api.get(`/tasks/${userId}`);
        setTasks(data);
      };
      fetchTasks();
    }
  }, [userId]);

  // Função para adicionar tarefa
  const addTask = async () => {
    if (title && userId) {
      await api.post("/tasks", { title, userId, status: "To Do" }); // Adiciona status "todo"
      const { data } = await api.get(`/tasks/${userId}`);
      setTasks(data);
      setTitle(""); // Limpa o campo de título
    }
  };

  // Função para atualizar o status de uma tarefa
  const updateTaskStatus = async (taskId, newStatus) => {
    await api.put(`/tasks/${taskId}`, { status: newStatus });
    const { data } = await api.get(`/tasks/${userId}`);
    setTasks(data);
  };

  // Função para renderizar tarefas por status
  const renderTasksByStatus = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <Draggable
          key={task.id}
          draggableId={task.id.toString()}
          index={task.id}
        >
          {(provided) => (
            <ListItem
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              sx={{
                pb: 1,
                borderBottom: "1px solid #ddd",
                backgroundColor: "#fff",
                borderRadius: "4px",
                marginBottom: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {task.title}
              </Typography>
            </ListItem>
          )}
        </Draggable>
      ));
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    // Verificar se o destino mudou
    if (destination.index !== source.index) {
      const updatedTasks = Array.from(tasks);
      const [removed] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, removed);
      setTasks(updatedTasks);
    }

    // Atualizar o status após a mudança de posição
    const updatedStatus = destination.droppableId;
    const taskId = result.draggableId;
    updateTaskStatus(taskId, updatedStatus);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: 3, height: "100vh" }}>
        <Typography variant="h4" gutterBottom>
          Lista de Tarefas
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Nova Tarefa"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button variant="contained" color="primary" onClick={addTask}>
            Adicionar Tarefa
          </Button>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={3} sx={{ height: "80vh" }}>
            {/* Coluna To Do */}
            <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                To Do
              </Typography>
              <Droppable droppableId="To Do">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      padding: "10px",
                      borderRadius: "8px",
                      height: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {renderTasksByStatus("To Do")}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>

            {/* Coluna Doing */}
            <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Doing
              </Typography>
              <Droppable droppableId="Doing">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      padding: "10px",
                      borderRadius: "8px",
                      height: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {renderTasksByStatus("Doing")}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>

            {/* Coluna Done */}
            <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Done
              </Typography>
              <Droppable droppableId="Done">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      padding: "10px",
                      borderRadius: "8px",
                      height: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {renderTasksByStatus("Done")}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          </Grid>
        </DragDropContext>
      </Box>
    </Container>
  );
}

export default TaskList;
