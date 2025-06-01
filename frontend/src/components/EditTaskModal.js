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
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api"; // API personalizada para requisições HTTP

/**
 * Modal de edição de tarefa
 * Permite alterar título, descrição, status, prioridade e anexos
 */
const EditTaskModal = ({ open, onClose, task, onSave, onDelete }) => {
  // Estados locais para os campos editáveis
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [newFiles, setNewFiles] = useState([]); // Novos arquivos a anexar
  const [attachments, setAttachments] = useState([]); // Anexos já existentes

  // Quando uma nova task é recebida, inicializa os campos
  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description || "");
      setEditPriority(task.priority);
      setEditStatus(task.status);
      setNewFiles([]); // Limpa novos arquivos ao editar outra tarefa
      setAttachments(task.attachments || []);
    }
  }, [task]);

  /**
   * Envia a tarefa atualizada para o componente pai
   */
  const handleSave = () => {
    onSave({
      id: task.id,
      title: editTitle,
      description: editDescription,
      priority: editPriority || task.priority,
      status: editStatus || task.status,
      userId: task.userId,
      newFiles,
    });
  };

  /**
   * Remove um anexo existente (no backend e na interface)
   */
  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await api.delete(`/tasks/attachment/${attachmentId}`);
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    } catch (err) {
      console.error("Erro ao excluir anexo", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Tarefa</DialogTitle>

      <DialogContent>
        {/* Campo: Título */}
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />

        {/* Campo: Descrição */}
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

        {/* Campo: Prioridade */}
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

        {/* Campo: Status */}
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

        {/* Upload de novos arquivos */}
        <FormControl fullWidth margin="dense">
          <input
            type="file"
            multiple
            onChange={(e) =>
              setNewFiles((prev) => [...prev, ...Array.from(e.target.files)])
            }
            accept="image/*, .pdf, .docx, .txt"
          />
        </FormControl>

        {/* Lista de anexos existentes com botão de exclusão */}
        {attachments.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Anexos</Typography>
            <ul>
              {attachments.map((file) => (
                <li
                  key={file.id}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: "10px" }}
                  >
                    {file.fileUrl.split("/").pop()}
                  </a>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAttachment(file.id)}
                    color="error"
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
        {task && (
          <Button
            href={`${window.location.origin}/shared/${task.id}`}
            target="_blank"
            variant="outlined"
            sx={{ mr: "auto" }}
          >
            Compartilhar
          </Button>
        )}
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
