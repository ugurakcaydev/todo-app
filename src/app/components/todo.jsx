import React, { useState } from "react";
import useDeleteTodoById from "../hooks/deleteTodoById";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import useUpdateTodo from "../hooks/updateTodo";
import { ClipLoader } from "react-spinners";
import { LuPin, LuPinOff } from "react-icons/lu";
import { formatDate } from "../utils/formatDate";

function Todo({ todo }) {
  const [editTodoId, setEditTodoId] = useState(null);
  const [newTitle, setNewTitle] = useState(todo.title);
  const queryClient = useQueryClient();
  const { mutate: deleteTodoById, isPending: isPendingDeleteTodo } =
    useDeleteTodoById({
      onSuccess: async () => {
        queryClient.invalidateQueries(["todos"]);
      },
    });

  const { mutate: updateTodo, isPending: isPendingUpdate } = useUpdateTodo({
    onSuccess: async () => {
      queryClient.invalidateQueries(["todos"]);
      setEditTodoId(null);
    },
  });

  const handleToggleComplete = () => {
    updateTodo({ id: todo.id, completed: !todo.completed });
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleTitleUpdate = () => {
    if (!newTitle) return;
    if (newTitle !== todo.title) {
      updateTodo({ id: todo.id, title: newTitle });
    } else {
      setEditTodoId(null);
    }
  };

  return (
    <div
      className={classNames(
        "w-full relative  group min-h-[65px] px-4 border-b hover:bg-zinc-50 hover:cursor-pointer  border-b-zinc-200 flex items-center justify-between gap-x-5",
        {
          "animate-pulse": isPendingDeleteTodo,
        }
      )}
    >
      {todo.isPinned && (
        <LuPin className=" absolute top-0.5 left-0.5 z-[2] size-[20px] -rotate-45 text-red-500 fill-red-400 " />
      )}

      <div className="flex flex-1 items-center  justify-start gap-x-3">
        <label className="relative flex cursor-pointer items-center">
          <input
            onChange={handleToggleComplete}
            type="checkbox"
            checked={todo.completed}
            className="size-6 rounded-full border border-zinc-200 peer hidden"
          />
          <div
            className={classNames(
              "size-5 flex items-center justify-center rounded-full border border-zinc-400",
              {
                "!border-green-500": todo.completed,
              }
            )}
          >
            {todo.completed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            )}
          </div>
        </label>
        <div className="flex flex-col flex-1">
          <span className="text-xs text-zinc-400 ">
            {formatDate(todo.createdAt)}
          </span>
          <div
            className={classNames("text-black font-sans w-full", {
              "line-through text-zinc-400 decoration-red-500": todo.completed,
            })}
          >
            {editTodoId === todo.id ? (
              <input
                type="text"
                value={newTitle}
                onChange={handleTitleChange}
                className={classNames(
                  "outline-none border border-zinc-200 rounded-md px-3 py-1 w-full",
                  {
                    "border !border-red-500": !newTitle,
                  }
                )}
                placeholder="Yeni başlık..."
              />
            ) : (
              todo.title
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-3 *:opacity-0 *:group-hover:opacity-100 *:transition-opacity *:duration-300 *:ease-linear">
        {/* PIN button*/}
        {!todo.completed && (
          <button
            onClick={() =>
              updateTodo({ id: todo.id, isPinned: !todo?.isPinned })
            }
            className="flex items-center justify-center group *:size-5"
          >
            {todo?.isPinned ? (
              <LuPinOff className="hover:text-red-500" />
            ) : (
              <LuPin className="hover:text-blue-500" />
            )}
          </button>
        )}

        {/* Eğer todo tamamlanmamışsa ve edit modundaysak */}
        {!todo.completed &&
          (editTodoId === todo.id ? (
            isPendingUpdate ? (
              <ClipLoader color="#22c55e" size={20} />
            ) : (
              <button
                onClick={handleTitleUpdate}
                className={classNames(
                  "bg-white size-5 border border-green-500 rounded-full flex items-center justify-center",
                  {
                    "cursor-not-allowed border-zinc-300": !newTitle,
                  }
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={classNames("size-3 text-green-500", {
                    "text-zinc-300": !newTitle,
                  })}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
            )
          ) : (
            <button
              onClick={() => {
                setEditTodoId(todo.id);
                setNewTitle(todo.title);
              }}
              className=" flex items-center justify-center group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 hover:text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          ))}
        {/* Trash button */}
        <button
          onClick={() => deleteTodoById(todo.id)}
          className="flex items-center justify-center group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 hover:text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Todo;
