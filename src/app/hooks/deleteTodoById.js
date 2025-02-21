import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";
const useDeleteTodoById = (options) => {
  return useMutation({
    mutationKey: ["deleteTodoById"],
    mutationFn: async (todoId) => {
      try {
        const data = await apiClient.deleteTodoById(todoId);
        return data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
    ...options,
  });
};

export default useDeleteTodoById;
