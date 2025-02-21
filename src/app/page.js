"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import useAddTodo from "./hooks/addTodo";
import useGetAllTodos from "./hooks/getAllTodos";
import useDeleteTodoById from "./hooks/deleteTodoById";
import Image from "next/image";
import Todo from "./components/todo";
import { ClipLoader, PacmanLoader } from "react-spinners";
import useDeleteAllTodos from "./hooks/deleteAllTodos";

const updateTodo = async ({ id, title, completed }) => {
  const res = await fetch("/api/todos", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, completed }),
  });

  if (!res.ok) throw new Error("Todo güncellenirken hata oluştu");
  return res.json();
};

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // QueryClient'ı almak
  const queryClient = useQueryClient();

  const { data: todos, isLoading: isTodosLoading, error } = useGetAllTodos();

  const { mutate: createTodo, isPending: isPendingTodo } = useAddTodo({
    onSuccess: async (data) => {
      setNewTodo("");
      console.log("Başarıyla Eklendi", data);
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const { mutate: deleteTodoById } = useDeleteTodoById({
    onSuccess: async (data) => {
      console.log("Başarıyla Silindi", data);
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const { mutate: deleteAll } = useDeleteAllTodos({
    onSuccess: async (data) => {
      console.log("Başarıyla Silindi", data);
      queryClient.invalidateQueries(["todos"]);
    },
  });

  // useMutation ile todo güncelleme
  const { mutate: modifyTodo } = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      // Başarılı olduğunda todos'u yeniden al
      queryClient.invalidateQueries(["todos"]);
    },
  });

  if (!isTodosLoading && error) return <p>Hata: {error.message}</p>;

  const handleAddTodo = () => {
    createTodo({ title: newTodo });
  };

  const handleEditTodo = () => {
    const todoToUpdate = todos.find((todo) => todo.id === editTodoId);
    modifyTodo({
      id: editTodoId,
      title: editTitle,
      completed: todoToUpdate?.completed,
    });
  };

  const handleToggleComplete = (id, completed) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    modifyTodo({ id, title: todoToUpdate?.title, completed: !completed });
  };

  return (
    <main className="w-full h-full flex flex-col ">
      {/* Banner */}
      <div className="w-full h-[300px] relative">
        <div className="w-full h-full relative overflow-hidden">
          <img
            src="https://images.wallpaperscraft.com/image/single/mountains_snow_winter_84608_1280x720.jpg"
            alt="banner"
            className="w-full h-full object-cover overflow-hidden"
          />
          <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-bl to-[#9F4EE1] from-[#77A0F8] opacity-60 " />
        </div>
        <div className="w-full max-w-lg mx-auto h-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
          <div className="w-full h-full flex flex-col justify-between ">
            <div className="w-full flex items-center justify-between">
              <div className="text-4xl text-white font-semibold font-sans">
                TODO
              </div>
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 text-white fill-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full h-auto min-h-[50px] bg-white text-black rounded-md flex items-center justify-center overflow-hidden px-4 ">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex items-center justify-start  w-full h-full outline-none  text-black pr-10  "
                placeholder="📝 Yeni todo ekleyin..."
              />
              <button
                onClick={handleAddTodo}
                className={classNames(
                  "p-1 bg-[#47A3EA] rounded-full flex items-center cursor-pointer pointer-events-auto justify-center opacity-100 transition-opacity duration-300 ease-linear text-white ",
                  {
                    "!opacity-0 !cursor-not-allowed !pointer-events-none":
                      newTodo.length == 0,
                  }
                )}
              >
                {isPendingTodo ? (
                  <ClipLoader size={20} color="#ffffff" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TODOS */}
      <div className="w-full max-w-lg mx-auto border border-[#f1f1f1] bg-white shadow-md rounded-md min-h-[300px] max-h-[600px] overflow-y-auto flex flex-col  -mt-12 z-10 mb-10">
        {isTodosLoading ? (
          <div className="w-full h-[300px] text-center p-4 flex items-center justify-center">
            <PacmanLoader color="#47A3EA" size={20} />
          </div>
        ) : todos.length === 0 ? (
          <div className=" w-full h-[300px]  flex flex-col items-center justify-center gap-x-4 ">
            <span className="text-black ">Buralar boş gözüküyor...</span>
          </div>
        ) : (
          todos.map((todo) => <Todo key={todo.id} todo={todo} />)
        )}
      </div>

      <button
        onClick={() => {
          deleteAll();
        }}
      >
        Tümünü sil
      </button>
    </main>
  );
}
