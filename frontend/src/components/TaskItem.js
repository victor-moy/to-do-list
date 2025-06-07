import React from "react";
import { ListItem, Typography, Box, Chip } from "@mui/material";

// Cores das prioridades em estilo neon/discreto
const priorityColors = {
  Low: "#00C853", // Neon verde
  Medium: "#FFD600", // Neon amarelo
  High: "#FF1744", // Neon vermelho
};

const TaskItem = ({ task, onClick, onDragStart, onDragOver, onDrop }) => {
  return (
    <ListItem
      draggable
      onClick={() => onClick(task)}
      onDragStart={() => onDragStart(task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task)}
      sx={{
        backgroundColor: "#1F1F28",
        borderLeft: `4px solid ${priorityColors[task.priority]}`,
        borderRadius: "8px",
        marginBottom: "12px",
        padding: "16px",
        cursor: "grab",
        transition: "transform 0.1s ease-in-out",
        "&:hover": {
          transform: "scale(1.01)",
        },
        display: "flex",
        flexDirection: "column",
        gap: 1,
        color: "#f5f5f5",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: "#fff", lineHeight: 1.4 }}
      >
        {task.title}
      </Typography>

      {task.description && (
        <Typography
          variant="body2"
          sx={{ color: "#bbb", fontSize: "0.875rem", lineHeight: 1.5 }}
        >
          {task.description}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Chip
          label={task.priority}
          size="small"
          sx={{
            backgroundColor: priorityColors[task.priority],
            color: "#000",
            fontWeight: "bold",
            fontSize: "0.75rem",
            px: 1,
          }}
        />
      </Box>
    </ListItem>
  );
};

export default TaskItem;
