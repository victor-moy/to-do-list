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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#2A2D3E",
          color: "#fff",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "#fff" }}>
        Editar Tarefa
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
          InputProps={{ style: { color: "#fff" } }}
          InputLabelProps={{ style: { color: "#ccc" } }}
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
          InputProps={{ style: { color: "#fff" } }}
          InputLabelProps={{ style: { color: "#ccc" } }}
        />

        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "#ccc" }}>Prioridade</InputLabel>
          <Select
            value={editPriority || task?.priority}
            onChange={(e) => setEditPriority(e.target.value)}
            sx={{ color: "#fff" }}
          >
            <MenuItem value="Low">Baixa</MenuItem>
            <MenuItem value="Medium">Média</MenuItem>
            <MenuItem value="High">Alta</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel sx={{ color: "#ccc" }}>Status</InputLabel>
          <Select
            value={editStatus || task?.status}
            onChange={(e) => setEditStatus(e.target.value)}
            sx={{ color: "#fff" }}
          >
            <MenuItem value="ToDo">A Fazer</MenuItem>
            <MenuItem value="Doing">Em Progresso</MenuItem>
            <MenuItem value="Done">Concluído</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setNewFiles((prev) => [...prev, ...Array.from(e.target.files)])
            }
            accept="image/*, .pdf, .docx, .txt"
            style={{ color: "#fff" }}
          />
        </FormControl>

        {attachments.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff" }}>
              Anexos
            </Typography>
            <ul style={{ paddingLeft: "1rem" }}>
              {attachments.map((file) => (
                <li
                  key={file.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#ccc",
                  }}
                >
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginRight: "10px",
                      color: "#90caf9",
                      wordBreak: "break-all",
                    }}
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

      <DialogActions
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "stretch",
          gap: 1,
          mt: 2,
        }}
      >
        {task && (
          <Button
            href={`${window.location.origin}/shared/${task.id}`}
            target="_blank"
            variant="outlined"
            sx={{
              flex: 1,
              color: "#90caf9",
              borderColor: "#90caf9",
            }}
          >
            Compartilhar
          </Button>
        )}

        <Button
          onClick={onClose}
          sx={{
            flex: 1,
            color: "#ccc",
            borderColor: "#444",
            border: "1px solid",
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            flex: 1,
            backgroundColor: "#3f8cff",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#336fd1",
            },
          }}
        >
          Salvar
        </Button>

        {task && (
          <IconButton
            onClick={() => onDelete(task.id)}
            color="error"
            sx={{ alignSelf: "center" }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
