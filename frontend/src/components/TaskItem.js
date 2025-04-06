import React from "react";
import { ListItem, Typography, Box, Chip } from "@mui/material";

const priorityColors = {
  Low: "#4CAF50",
  Medium: "#FFC107",
  High: "#F44336",
};

const TaskItem = ({ task, onClick, onDragStart, onDragOver, onDrop }) => {
  return (
    <ListItem
      key={task.id}
      draggable
      onClick={() => onClick(task)}
      onDragStart={() => onDragStart(task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task)}
      sx={{
        border: `1px solid ${priorityColors[task.priority]}`,
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
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {task.title}
      </Typography>
      {task.description && (
        <Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>
      )}
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
