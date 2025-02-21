import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";

const useGetAllTodos = (options) => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: () => apiClient.getAllTodos(),
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useGetAllTodos;
