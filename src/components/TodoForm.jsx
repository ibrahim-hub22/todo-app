import { useState } from "react";
export default function TodoForm({ initialData = {}, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [completed, setCompleted] = useState(initialData.completed || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      title,
      completed,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}

