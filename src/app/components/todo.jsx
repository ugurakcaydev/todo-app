import React from "react";
import useDeleteTodoById from "../hooks/deleteTodoById";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import useUpdateTodo from "../hooks/updateTodo";

function Todo({ todo }) {
  const queryClient = useQueryClient();
  const { mutate: deleteTodoById, isPending: isPendingDeleteTodo } =
    useDeleteTodoById({
      onSuccess: async () => {
        queryClient.invalidateQueries(["todos"]);
      },
    });

  const { mutate: updateTodo } = useUpdateTodo({
    onSuccess: async () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  // Title değişimini yönetmek için state
  const [newTitle, setNewTitle] = React.useState(todo.title);

  const handleToggleComplete = () => {
    updateTodo({ id: todo.id, completed: !todo.completed });
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleTitleUpdate = () => {
    if (newTitle !== todo.title) {
      updateTodo({ id: todo.id, title: newTitle });
    }
  };

  return (
    <div
      className={classNames(
        "w-full group min-h-[60px] px-4 border-b hover:bg-zinc-50 hover:cursor-pointer  border-b-zinc-200 flex items-center justify-between",
        {
          "animate-pulse": isPendingDeleteTodo,
        }
      )}
    >
      <div className="flex items-center justify-start gap-x-4">
        <label className="relative flex cursor-pointer items-center">
          <input
            onChange={handleToggleComplete}
            type="checkbox"
            checked={todo.completed}
            className="size-6 rounded-full border border-zinc-200 peer hidden"
          />
          <div className="size-6 rounded-full border border-zinc-200" />
        </label>
        <div
          className={classNames("text-black font-sans", {
            "line-through text-zinc-400 decoration-red-500": todo.completed,
          })}
        >
          {todo.title}
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-linear">
        {/* Correction */}
        {!todo.completed && (
          <button className=" flex items-center justify-center group">
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>
        )}

        {/* Trash */}
        <button
          onClick={() => deleteTodoById(todo.id)}
          className=" flex items-center justify-center group"
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
