import React, { useState } from "react";
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
  Input,
} from "@mui/material";

const AddTaskModal = ({ open, onClose, onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ToDo");
  const [priority, setPriority] = useState("Medium");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prevFiles) => [...prevFiles, file]);
    }
  };

  const handleAdd = () => {
    onAddTask({ title, description, status, priority, files });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descrição"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="ToDo">A Fazer</MenuItem>
            <MenuItem value="Doing">Em Progresso</MenuItem>
            <MenuItem value="Done">Concluído</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
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
        <FormControl fullWidth margin="dense">
          <Input
            id="add-attachment"
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: "image/*, .pdf, .docx, .txt" }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleAdd} variant="contained" color="primary">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;
