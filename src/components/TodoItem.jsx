// src/components/TodoItem.jsx
export default function TodoItem({ todo, toggleComplete, deleteTodo }) {
  return (
    <li className="flex justify-between items-center p-2 border rounded">
      <span
        className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}
        onClick={() => toggleComplete(todo.id)}
      >
        {todo.text}
      </span>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="ml-4 text-red-500"
      >
        Delete
      </button>
    </li>
  );
}
