import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Importação do GoogleOAuthProvider
import TaskList from "./pages/TaskList";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Importação da tela de cadastro
import SharedTaskPage from "./pages/SharedTaskPage";

const clientId =
  "94362032696-7lqiqbivh1l52spvvlj9rt09o1ncjjd3.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/shared/:id" element={<SharedTaskPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
