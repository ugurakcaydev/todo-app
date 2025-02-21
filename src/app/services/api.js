import axios from "axios";

const api = axios.create({
  baseURL: "/api/todos",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
