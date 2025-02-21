import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";

const useAddTodo = (options) => {
  return useMutation({
    mutationKey: ["addTodo"],
    mutationFn: async (todo) => {
      try {
        const data = await apiClient.addTodo(todo);
        return data;
      } catch (error) {
        showToast("error", error.message || "Bir hata oluştu.");
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
    ...options,
  });
};

export default useAddTodo;
