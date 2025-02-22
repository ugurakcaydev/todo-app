"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import useAddTodo from "./hooks/addTodo";
import useGetAllTodos from "./hooks/getAllTodos";
import Todo from "./components/todo";
import { ClipLoader } from "react-spinners";
import useDeleteAllTodos from "./hooks/deleteAllTodos";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "./utils/formatDate";

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
  const [selectedDate, setSelectedDate] = useState(new Date());

  const queryClient = useQueryClient();

  const { data: todos, isLoading: isTodosLoading, error } = useGetAllTodos();

  const { mutate: createTodo, isPending: isPendingTodo } = useAddTodo({
    onSuccess: async (data) => {
      setNewTodo("");
      console.log("Başarıyla Eklendi", data);
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const { mutate: deleteAll, isPending: isPendingDelete } = useDeleteAllTodos({
    onSuccess: async (data) => {
      console.log("Başarıyla Silindi", data);
      queryClient.invalidateQueries(["todos"]);
    },
  });

  if (!isTodosLoading && error) return <p>Hata: {error.message}</p>;

  const handleAddTodo = () => {
    createTodo({ title: newTodo });
  };

  const sortedTodos = todos?.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <main className="w-full h-full flex flex-col ">
      {/* Banner */}
      <div className="w-full h-[300px] relative">
        <div className="w-full h-full  ">
          <img
            src="https://images.wallpaperscraft.com/image/single/mountains_snow_winter_84608_1280x720.jpg"
            alt="banner"
            className="w-full h-full object-cover"
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

            {/* INPUT */}
            <div className="w-full relative h-auto min-h-[50px] bg-white text-black rounded-md flex items-center justify-center px-4 ">
              <span className="absolute right-0 -top-8 text-white font-bold text-[20px]">
                {formatDate(new Date())}
              </span>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTodo();
                  }
                }}
                className="flex flex-1 items-center justify-start  h-full outline-none  text-black pr-10  "
                placeholder="Todo ekleyin... 📝 "
              />
              <div
                className={classNames(
                  "flex items-center justify-end gap-x-2  opacity-100 transition-opacity duration-300 ease-linear",
                  {
                    "!opacity-0 *:cursor-not-allowed *:pointer-events-none":
                      newTodo.length == 0,
                  }
                )}
              >
                <button
                  onClick={handleAddTodo}
                  className={classNames(
                    "p-1 bg-[#47A3EA] rounded-full flex items-center cursor-pointer pointer-events-auto justify-center text-white "
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
                      className="size-4"
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
      </div>

      {/* CONTAINER */}
      <div className="w-full max-w-lg mx-auto flex flex-col gap-y-4 -mt-10 z-[1] ">
        {/* TODOS */}
        <div className="w-full relative max-w-lg mx-auto border border-[#f1f1f1] bg-white shadow-md rounded-md min-h-[327px] max-h-[360px] overflow-y-auto  flex flex-col ">
          {isTodosLoading ? (
            <div className="w-full h-[300px] text-center p-4 flex items-center justify-center">
              <ClipLoader color="#47A3EA" size={30} />
            </div>
          ) : todos.length === 0 ? (
            <div className=" w-full h-[298px]  flex flex-col items-center justify-center  ">
              Buralar boş gözüküyor...
            </div>
          ) : (
            sortedTodos.map((todo) => <Todo key={todo.id} todo={todo} />)
          )}
        </div>

        {todos?.length > 0 && (
          <div className="w-full flex items-center justify-end">
            <button
              onClick={() => {
                deleteAll();
              }}
              className="text-sm flex items-center min-w-[85px] justify-center px-4 py-1 border border-white text-white bg-red-500 rounded-md hover:opacity-95"
            >
              {isPendingDelete ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                "Temizle"
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
