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
import api from "../services/api";

const EditTaskModal = ({ open, onClose, task, onSave, onDelete }) => {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description || "");
      setEditPriority(task.priority);
      setEditStatus(task.status);
      setNewFiles([]);
      setAttachments(task.attachments || []);
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
      newFiles,
    });
  };

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
          backgroundColor: "#1F1F28",
          color: "#fff",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Editar Tarefa
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Título"
          variant="filled"
          fullWidth
          margin="dense"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
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
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          InputProps={{ style: { backgroundColor: "#121212", color: "#fff" } }}
          InputLabelProps={{ style: { color: "#888" } }}
        />

        <FormControl fullWidth margin="dense" variant="filled">
          <InputLabel sx={{ color: "#888" }}>Prioridade</InputLabel>
          <Select
            value={editPriority || task?.priority}
            onChange={(e) => setEditPriority(e.target.value)}
            sx={{ backgroundColor: "#121212", color: "#fff" }}
          >
            <MenuItem value="Low">Baixa</MenuItem>
            <MenuItem value="Medium">Média</MenuItem>
            <MenuItem value="High">Alta</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" variant="filled">
          <InputLabel sx={{ color: "#888" }}>Status</InputLabel>
          <Select
            value={editStatus || task?.status}
            onChange={(e) => setEditStatus(e.target.value)}
            sx={{ backgroundColor: "#121212", color: "#fff" }}
          >
            <MenuItem value="ToDo">A Fazer</MenuItem>
            <MenuItem value="Doing">Em Progresso</MenuItem>
            <MenuItem value="Done">Concluído</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <input
            type="file"
            multiple
            onChange={(e) =>
              setNewFiles((prev) => [...prev, ...Array.from(e.target.files)])
            }
            accept="image/*, .pdf, .docx, .txt"
            style={{ color: "#aaa", marginTop: 8 }}
          />
        </FormControl>

        {attachments.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle2" color="gray">
              Anexos
            </Typography>
            <ul style={{ paddingLeft: 16 }}>
              {attachments.map((file) => (
                <li
                  key={file.id}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginRight: 10,
                      color: "#90caf9",
                      wordBreak: "break-all",
                      fontSize: "0.9rem",
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
          px: 3,
          pb: 2,
          pt: 2,
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
        <Button onClick={onClose} sx={{ flex: 1, color: "#ccc" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            flex: 1,
            backgroundColor: "#3f8cff",
            color: "#fff",
            "&:hover": { backgroundColor: "#336fd1" },
          }}
        >
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
