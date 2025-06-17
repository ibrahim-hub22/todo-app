// src/components/TodoList.jsx
import TodoItem from "./TodoItem";

export default function TodoList({ todos, toggleComplete, deleteTodo }) {
  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
}
