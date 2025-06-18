import localforage from "localforage";

const TODOS_KEY = "cached_todos";

export const getCachedTodos = async () => {
  const data = await localforage.getItem(TODOS_KEY);
  return data || null;
};

export const setCachedTodos = async (todos) => {
  await localforage.setItem(TODOS_KEY, todos);
};
