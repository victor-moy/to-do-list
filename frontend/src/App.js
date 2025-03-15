import React, { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    api.get("/tasks/1").then((response) => {
      setTasks(response.data);
    });
  }, []);

  const addTask = async () => {
    await api.post("/tasks", {
      title,
      userId: "f8f5e417-f28c-4b0d-9c87-775589bc5d36",
    });
    const response = await api.get(
      "/tasks/f8f5e417-f28c-4b0d-9c87-775589bc5d36"
    );
    setTasks(response.data);
    setTitle("");
  };

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Adicionar</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
