import api from "./api";

export const apiClient = {
  //Add Todo
  addTodo: async (todo) => {
    try {
      const response = await api.post("/", todo);
      return response.data;
    } catch (error) {
      console.error("Failed to add todo:", error);
      throw error;
    }
  },

  //Delete Todo
  deleteTodoById: async (todoId) => {
    try {
      const response = await api.delete("/", {
        data: { id: todoId },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to delete todo:", error);
      throw error;
    }
  },

  //Delete All Todos
  deleteAllTodos: async () => {
    try {
      const response = await api.delete("/?all=true");
      return response.data;
    } catch (error) {
      console.error("Failed to delete all todos:", error);
      throw error;
    }
  },

  //Get All Todos
  getAllTodos: async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      console.error("Failed to get all todos:", error);
      throw error;
    }
  },

  //Update Todo
  updateTodo: async ({ id, title, completed, isPinned }) => {
    try {
      const response = await api.patch(`/`, { id, title, completed, isPinned });
      return response.data;
    } catch (error) {
      console.error("Failed to update todo:", error);
      throw error;
    }
  },
};
