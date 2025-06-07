import React from "react";
import {
  Box,
  Typography,
  List,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TaskItem from "./TaskItem";

const TaskColumn = ({
  status,
  statusLabel,
  tasks,
  onDragOver,
  onDrop,
  onTaskClick,
  onDragStart,
  onDropOnItem,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      item
      xs={12}
      sm={isMobile ? 12 : 4}
      md={4}
      lg={4}
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: isMobile ? "100%" : "30vw",
        maxWidth: isMobile ? "100%" : "30vw",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(22, 27, 34, 0.95)",
          borderRadius: "10px",
          padding: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #2d2d44",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{
            color: "#ffffffcc",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          {statusLabel} ({tasks.length})
        </Typography>

        <Box
          sx={{
            flex: 1,
            backgroundColor: "#0f0f1b",
            padding: 1,
            borderRadius: "8px",
            overflowY: "auto",
            minHeight: "120px",
          }}
        >
          <List sx={{ padding: 0 }}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={onTaskClick}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={(e) => onDropOnItem(e, task)}
              />
            ))}
          </List>
        </Box>
      </Box>
    </Grid>
  );
};

export default TaskColumn;
