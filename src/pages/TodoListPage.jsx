import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoForm from "../components/TodoForm";
import DeleteModal from "../components/DeleteModal";
import { X, SquarePen, Trash2, Plus, Check } from "lucide-react";

export default function TodoListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [todoToDelete, setTodoToDelete] = useState(null);

  const queryClient = useQueryClient();

  const itemsPerPage = 10;

  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
      return res.data;
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: async (newTodo) => {
      const res = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        {
          ...newTodo,
          userId: 1,
        }
      );
      return res.data;
    },
    onSuccess: (newTodo) => {
      // Add the new todo manually to the cached list
      queryClient.setQueryData(["todos"], (old = []) => [
        { ...newTodo, id: Date.now(), completed: false }, // simulate a unique ID and completed flag
        ...old,
      ]);
      setIsCreating(false);
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (updatedTodo) => {
      const res = await axios.put(
        `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
        updatedTodo
      );
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["todos"], (old = []) =>
        old.map((todo) => (todo.id === updated.id ? updated : todo))
      );
      setEditingTodo(null);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setTodoToDelete(null);
    },
  });

  if (isLoading) return <div className="p-6">Loading todos...</div>;
  if (isError)
    return <div className="p-6 text-red-600">Error loading todos.</div>;

  // 🧠 Filter by search + status
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      status === "all"
        ? true
        : status === "completed"
        ? todo.completed
        : !todo.completed;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Ibrahim's Todos</h1>
      <div className="flex w-full justify-end">
        <button
          onClick={() => setIsCreating(true)}
          className=" flex justify-end mb-4 px-4 py-2 bg-green-600 text-white rounded flex gap-1 hover:bg-green-800 hover:scale-90 transition-all duration-300 ease-in"
        >
          <Plus /> Add Todo
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 border p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Create New Todo</h2>
          <TodoForm
            onSubmit={(data) => createTodoMutation.mutate(data)}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {/* 🔍 Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/2 px-3 py-2 border rounded flex-1"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/3 px-3 py-2 border rounded flex-1"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* 📝 Todo Items */}
      <ul className="space-y-4 mb-6">
        {editingTodo && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow max-w-md w-full relative">
              <h2 className="text-lg font-semibold mb-2">Edit Todo</h2>
              <TodoForm
                initialData={editingTodo}
                onSubmit={(data) => {
                  updateTodoMutation.mutate(data);
                }}
                onCancel={() => setEditingTodo(null)}
              />
            </div>
          </div>
        )}
        {currentTodos.map((todo) => (
          <li
            key={todo.id}
            className={`border p-4 rounded shadow hover:shadow-md transition ${
              todo.completed
                ? "bg-green-100 text-green-800 border-green-200 border p-4 rounded shadow hover:shadow-md transition w-full"
                : "bg-yellow-100 text-yellow-800 border-yellow-200 border p-4 rounded shadow hover:shadow-md transition w-full"
            }`}
          >
            <div className="flex justify-between">
              <Link
                to={`/todos/${todo.id}`}
                className="block text-lg font-medium hover:underline flex-1"
              >
                {todo.title}
              </Link>
              <div className="flex gap-3">
                <button
                  className="mt-2 text-sm hover:underline"
                  onClick={() => setEditingTodo(todo)}
                >
                  <SquarePen />
                </button>
                <button
                  onClick={() => setTodoToDelete(todo)}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 flex gap-1 items-center ">
              {todo.completed ? (
                <>
                  <Check className="inline w-4 h-full text-green-500" />
                  <p> Completed</p>
                </>
              ) : (
                <>
                  <X className="inline w-4 h-full text-red-500" />{" "}
                  <p> Not completed</p>
                </>
              )}
            </p>
          </li>
        ))}

        {todoToDelete && (
          <DeleteModal
            onCancel={() => setTodoToDelete(null)}
            onConfirm={() => deleteTodoMutation.mutate(todoToDelete.id)}
          />
        )}

        {currentTodos.length === 0 && (
          <li className="text-gray-500 text-center py-8">
            No todos match your search or filter.
          </li>
        )}
      </ul>

      {/* 🔄 Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
