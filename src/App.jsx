import NotFoundPage from "./pages/NotFoundPage";
import TodoDetailPage from "./pages/TodoDetailPage";
import { Navigate, Route, Routes } from "react-router-dom";

import TodoListPage from "./pages/TodoListPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/todos" />} />
      <Route path="/todos" element={<TodoListPage />} />
      <Route path="/todos/:id" element={<TodoDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
