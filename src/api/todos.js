import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const fetchTodos = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/todos`, {
    params: {
      _page: page,
      _limit: limit,
    },
  });
  return {
    data: response.data,
    total: Number(response.headers['x-total-count']),
  };
};

export const fetchTodoById = async (id) => {
  const response = await axios.get(`${API_URL}/todos/${id}`);
  return response.data;
};
