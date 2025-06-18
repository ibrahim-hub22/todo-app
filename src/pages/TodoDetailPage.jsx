import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function TodoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: todo, isLoading, isError } = useQuery({
    queryKey: ['todo', id],
    queryFn: async () => {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6 text-lg">Loading...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading todo</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo Detail</h1>
      <div className="bg-white shadow-md rounded p-4 border">
        <p><span className="font-semibold">ID:</span> {todo.id}</p>
        <p><span className="font-semibold">Title:</span> {todo.title}</p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          {todo.completed ? "✅ Completed" : "❌ Not completed"}
        </p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back to List
      </button>
    </div>
  );
}
