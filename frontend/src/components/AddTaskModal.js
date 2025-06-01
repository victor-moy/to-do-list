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

/**
 * Componente de modal para adicionar uma nova tarefa
 * Inclui campos de texto, seleção de status e prioridade, e upload de arquivos
 */
const AddTaskModal = ({ open, onClose, onAddTask }) => {
  // Estados dos campos
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ToDo");
  const [priority, setPriority] = useState("Medium");
  const [files, setFiles] = useState([]);

  /**
   * Atualiza os arquivos selecionados no input de upload
   */
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  /**
   * Remove um arquivo específico da lista de uploads
   */
  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  /**
   * Função chamada ao clicar em "Adicionar"
   * Envia os dados para o componente pai e limpa os campos
   */
  const handleAdd = () => {
    onAddTask({ title, description, status, priority, files });

    // Limpa os campos após o envio
    setTitle("");
    setDescription("");
    setStatus("ToDo");
    setPriority("Medium");
    setFiles([]);

    onClose(); // Fecha o modal
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Nova Tarefa</DialogTitle>

      <DialogContent>
        {/* Campo de título */}
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Campo de descrição */}
        <TextField
          margin="dense"
          label="Descrição"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Status da tarefa */}
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

        {/* Prioridade da tarefa */}
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

        {/* Upload de arquivos */}
        <FormControl fullWidth margin="dense">
          <Input
            id="add-attachment"
            type="file"
            multiple
            onChange={handleFileChange}
            inputProps={{ accept: "image/*, .pdf, .docx, .txt" }}
          />
        </FormControl>

        {/* Exibição da lista de arquivos selecionados */}
        {files.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2">Arquivos selecionados:</Typography>
            <ul>
              {files.map((file, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center" }}>
                  {file.name}
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

      {/* Botões de ação */}
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
