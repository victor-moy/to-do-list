import React from "react";
import { ListItem, Typography, Box, Chip } from "@mui/material";

// Mapeamento de cores baseado na prioridade
const priorityColors = {
  Low: "#4CAF50", // Verde: baixa prioridade
  Medium: "#FFC107", // Amarelo: prioridade média
  High: "#F44336", // Vermelho: alta prioridade
};

/**
 * Componente que representa visualmente uma única tarefa dentro da coluna.
 * Permite clique para abrir o modal de edição e suporte a drag-and-drop.
 */
const TaskItem = ({ task, onClick, onDragStart, onDragOver, onDrop }) => {
  return (
    <ListItem
      draggable // Torna o item arrastável
      onClick={() => onClick(task)} // Ao clicar, abre o modal
      onDragStart={() => onDragStart(task.id)} // Início do drag (envia ID da tarefa)
      onDragOver={onDragOver} // Permite drop por cima
      onDrop={(e) => onDrop(e, task)} // Drop realizado sobre outra tarefa
      sx={{
        border: `1px solid ${priorityColors[task.priority]}`, // Borda com base na prioridade
        backgroundColor: "#f9f9f9",
        borderRadius: "4px",
        marginBottom: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
        padding: "12px",
        cursor: "grab",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
      }}
    >
      {/* Título da tarefa */}
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {task.title}
      </Typography>

      {/* Descrição, se existir */}
      {task.description && (
        <Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>
      )}

      {/* Chip com a prioridade */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Chip
          label={task.priority}
          size="small"
          sx={{
            backgroundColor: priorityColors[task.priority],
            color: "#fff",
            fontSize: "0.75rem",
          }}
        />
      </Box>
    </ListItem>
  );
};

export default TaskItem;
