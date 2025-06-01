// App.js
// Ponto de entrada das rotas e configuração global do Google OAuth

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./pages/TaskList";
import SharedTaskPage from "./pages/SharedTaskPage";

// ID do cliente Google (OAuth2) - necessário para autenticação com Google
const clientId =
  "94362032696-7lqiqbivh1l52spvvlj9rt09o1ncjjd3.apps.googleusercontent.com";

// Componente principal que define as rotas e provedor de autenticação
function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          {/* Página inicial (login) */}
          <Route path="/" element={<Login />} />

          {/* Cadastro de novo usuário */}
          <Route path="/register" element={<Register />} />

          {/* Lista de tarefas (usuário logado) */}
          <Route path="/tasks" element={<TaskList />} />

          {/* Visualização pública de tarefa compartilhada */}
          <Route path="/shared/:id" element={<SharedTaskPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
