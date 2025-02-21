import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";
const useDeleteAllTodos = (options) => {
  return useMutation({
    mutationKey: ["deleteAllTodos"],
    mutationFn: async () => {
      try {
        const response = await apiClient.deleteAllTodos();
        return response;
      } catch (error) {
        console.error("Tüm Todolar silinirken hata oluştu:", error);
        throw error; // Hata durumunda fırlatılıyor
      }
    },
    onError: (error) => {
      console.error("Tüm Todolar silinirken hata oluştu:", error);
    },
    ...options, // Opsiyonel ek parametreler
  });
};

export default useDeleteAllTodos;
