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
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AddTaskModal = ({ open, onClose, onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ToDo");
  const [priority, setPriority] = useState("Medium");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAdd = () => {
    onAddTask({ title, description, status, priority, files });
    setTitle("");
    setDescription("");
    setStatus("ToDo");
    setPriority("Medium");
    setFiles([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#1F1F28",
          color: "#fff",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Adicionar Nova Tarefa
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Título"
          variant="filled"
          fullWidth
          margin="dense"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputProps={{ style: { backgroundColor: "#121212", color: "#fff" } }}
          InputLabelProps={{ style: { color: "#888" } }}
        />

        <TextField
          label="Descrição"
          variant="filled"
          fullWidth
          margin="dense"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputProps={{ style: { backgroundColor: "#121212", color: "#fff" } }}
          InputLabelProps={{ style: { color: "#888" } }}
        />

        <FormControl fullWidth margin="dense" variant="filled">
          <InputLabel sx={{ color: "#888" }}>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ backgroundColor: "#121212", color: "#fff" }}
          >
            <MenuItem value="ToDo">A Fazer</MenuItem>
            <MenuItem value="Doing">Em Progresso</MenuItem>
            <MenuItem value="Done">Concluído</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" variant="filled">
          <InputLabel sx={{ color: "#888" }}>Prioridade</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            sx={{ backgroundColor: "#121212", color: "#fff" }}
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
            multiple
            onChange={handleFileChange}
            inputProps={{ accept: "image/*, .pdf, .docx, .txt" }}
            sx={{ color: "#aaa", mt: 1 }}
          />
        </FormControl>

        {files.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="gray">
              Arquivos selecionados:
            </Typography>
            <ul style={{ paddingLeft: 16 }}>
              {files.map((file, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    {file.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(idx)}
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#ccc" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{
            backgroundColor: "#3f8cff",
            color: "#fff",
            "&:hover": { backgroundColor: "#336fd1" },
          }}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;
