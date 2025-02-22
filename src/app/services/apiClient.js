import api from "./api";

export const apiClient = {
  //Add Todo
  addTodo: async (todo) => {
    try {
      const response = await api.post("/", todo); // Burada `todo` nesnesini gönderiyoruz
      return response.data; // Sadece `data` döndürüyoruz, böylece daha temiz bir kullanım olur.
    } catch (error) {
      console.error("Failed to add todo:", error);
      throw error; // Hata fırlatılacak, üst seviyede yakalanabilir.
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
      const response = await api.delete("/?all=true"); // API'nin DELETEALL endpoint'ine istek gönderiyoruz
      return response.data; // Gelen response'u döndürüyoruz
    } catch (error) {
      console.error("Failed to delete all todos:", error);
      throw error; // Hata fırlatılır
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
