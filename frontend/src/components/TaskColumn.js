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
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: isMobile ? "100%" : "30vw",
        maxWidth: isMobile ? "100%" : "30vw",
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: 2,
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        <Typography
          variant="subtitle2"
          align="center"
          gutterBottom
          sx={{ color: "#777", mb: 1 }}
        >
          {statusLabel}
        </Typography>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#eee",
            padding: 1,
            borderRadius: "8px",
            overflowY: "auto",
            minHeight: "100px",
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
                onDrop={onDropOnItem}
              />
            ))}
          </List>
        </Box>
      </Box>
    </Grid>
  );
};

export default TaskColumn;
