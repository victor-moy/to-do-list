import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import api from "../services/api";
import AddIcon from "@mui/icons-material/Add";
import EditTaskModal from "../components/EditTaskModal";
import AddTaskModal from "../components/AddTaskModal";
import TaskColumn from "../components/TaskColumn"; // Importe o componente TaskColumn

const statusLabels = {
  ToDo: "A Fazer",
  Doing: "Em Progresso",
  Done: "Concluído",
};

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const userId = localStorage.getItem("userId");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/${userId}`);
      setTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas", error);
    }
  };

  const handleOpenAddTask = () => {
    setIsAddingTask(true);
  };

  const handleCloseAddTask = () => {
    setIsAddingTask(false);
  };

  const handleAddTask = async (newTaskData) => {
    if (newTaskData.title && userId) {
      const formData = new FormData();
      formData.append("title", newTaskData.title);
      formData.append("description", newTaskData.description);
      formData.append("status", newTaskData.status);
      formData.append("priority", newTaskData.priority);
      formData.append("userId", userId);

      newTaskData.files.forEach((file) => {
        formData.append("files", file);
      });

      try {
        await api.post("/tasks", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fetchTasks();
        handleCloseAddTask();
      } catch (error) {
        console.error("Erro ao adicionar tarefa com anexo", error);
      }
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      const { title, description, priority, userId } = taskToUpdate;
      try {
        await api.put(`/tasks/${taskId}`, {
          title,
          description,
          status: newStatus,
          priority,
          userId,
        });
        fetchTasks();
      } catch (error) {
        console.error("Erro ao atualizar status da tarefa", error);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      console.error("Erro ao excluir tarefa", error);
    }
  };

  const handleUpdateTaskDetails = async (updatedTaskData) => {
    if (selectedTask) {
      try {
        const formData = new FormData();
        formData.append("title", updatedTaskData.title);
        formData.append("description", updatedTaskData.description);
        formData.append("status", updatedTaskData.status);
        formData.append("priority", updatedTaskData.priority);
        formData.append("userId", updatedTaskData.userId);

        if (updatedTaskData.newFiles?.length > 0) {
          updatedTaskData.newFiles.forEach((file) => {
            formData.append("files", file);
          });
        }

        await api.put(`/tasks/${selectedTask.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

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
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        padding: 4,
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 400 }}>
          Lista de Tarefas
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenAddTask}
        >
          Adicionar Tarefa
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {["ToDo", "Doing", "Done"].map((status) => (
          <TaskColumn
            key={status}
            status={status}
            statusLabel={statusLabels[status]}
            tasks={tasks.filter((task) => task.status === status)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropColumn(e, status)}
            onTaskClick={handleTaskClick}
            onDragStart={handleDragStart}
            onDropOnItem={handleDropOnItem}
          />
        ))}
      </Grid>

      {/* Modal de Adicionar Tarefa (agora usando o componente separado) */}
      <AddTaskModal
        open={isAddingTask}
        onClose={handleCloseAddTask}
        onAddTask={handleAddTask}
      />

      {/* Modal de Edição de Tarefa */}
      <EditTaskModal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onSave={handleUpdateTaskDetails}
        onDelete={handleDeleteTask}
      />
    </Container>
  );
}

export default TaskList;
