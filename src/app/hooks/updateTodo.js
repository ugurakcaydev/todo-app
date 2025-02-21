import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";

const useUpdateTodo = (options) => {
  return useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async ({ id, title, completed }) => {
      try {
        const data = await apiClient.updateTodo({
          id: id,
          title: title,
          completed: completed,
        });
        return data;
      } catch (error) {
        console.log(error, "error");
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
    ...options,
  });
};

export default useUpdateTodo;
