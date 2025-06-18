import Dexie from "dexie";

export const db = new Dexie("TodoDB");

db.version(1).stores({
  todos: "++id, title, completed", // Primary key is auto-incremented id, with title and completed as indexed fields
});