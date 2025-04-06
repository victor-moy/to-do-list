import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const EditTaskModal = ({ open, onClose, task, onSave, onDelete }) => {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description || "");
      setEditPriority(task.priority);
      setEditStatus(task.status);
    }
  }, [task]);

  const handleSave = () => {
    onSave({
      id: task.id,
      title: editTitle,
      description: editDescription,
      priority: editPriority || task.priority,
      status: editStatus || task.status,
      userId: task.userId,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Tarefa</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Descrição"
          fullWidth
          multiline
          rows={3}
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel>Prioridade</InputLabel>
          <Select
            value={editPriority || task?.priority}
            label="Prioridade"
            onChange={(e) => setEditPriority(e.target.value)}
          >
            <MenuItem value="Low">Baixa</MenuItem>
            <MenuItem value="Medium">Média</MenuItem>
            <MenuItem value="High">Alta</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={editStatus || task?.status}
            label="Status"
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <MenuItem value="ToDo">A Fazer</MenuItem>
            <MenuItem value="Doing">Em Progresso</MenuItem>
            <MenuItem value="Done">Concluído</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvar
        </Button>
        {task && (
          <IconButton onClick={() => onDelete(task.id)} color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
