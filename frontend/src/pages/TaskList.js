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
import AddIcon from "@mui/icons-material/Add";
import api from "../services/api";
import EditTaskModal from "../components/EditTaskModal";
import AddTaskModal from "../components/AddTaskModal";
import TaskColumn from "../components/TaskColumn";

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
    if (userId) fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/${userId}`);
      setTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas", error);
    }
  };

  const handleOpenAddTask = () => setIsAddingTask(true);
  const handleCloseAddTask = () => setIsAddingTask(false);

  const handleAddTask = async (newTaskData) => {
    if (newTaskData.title && userId) {
      const formData = new FormData();
      formData.append("title", newTaskData.title);
      formData.append("description", newTaskData.description);
      formData.append("status", newTaskData.status);
      formData.append("priority", newTaskData.priority);
      formData.append("userId", userId);
      newTaskData.files.forEach((file) => formData.append("files", file));
      try {
        await api.post("/tasks", formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
          updatedTaskData.newFiles.forEach((file) =>
            formData.append("files", file)
          );
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

  const handleDragStart = (taskId) => setDraggedTaskId(taskId);
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

  const handleDragOver = (e) => e.preventDefault();
  const handleTaskClick = (task) => setSelectedTask(task);

  return (
    <Box
      sx={{
        background: "radial-gradient(circle at top, #0d1117, #000)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 4,
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          color: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Tacly - Lista de Tarefas
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenAddTask}
          sx={{
            color: "#9c27b0",
            borderColor: "#9c27b0",
            "&:hover": {
              backgroundColor: "rgba(156, 39, 176, 0.1)",
              borderColor: "#ba68c8",
            },
          }}
        >
          Adicionar Tarefa
        </Button>
      </Box>

      <Grid container spacing={2}>
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

      <AddTaskModal
        open={isAddingTask}
        onClose={handleCloseAddTask}
        onAddTask={handleAddTask}
      />

      <EditTaskModal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onSave={handleUpdateTaskDetails}
        onDelete={handleDeleteTask}
      />
    </Box>
  );
}

export default TaskList;
