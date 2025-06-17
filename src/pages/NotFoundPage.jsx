import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold mb-4 text-red-600">404</h1>
      <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/todos"
        className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Back to Todos
      </Link>
    </div>
  );
}
