"use client";

import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  function addTodo() {
    if (!task.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTask("");
  }

  function toggleTodo(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos(todos.filter((todo) => !todo.completed));
  }

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  const remainingCount = todos.length - completedCount;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl shadow-lg">
            ✓
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            My Todo List
          </h1>

          <p className="mt-2 text-slate-500">
            Stay organized and get things done.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">

          {/* Add Todo */}
          <div className="border-b border-slate-100 p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTodo();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <button
                onClick={addTodo}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-bold text-slate-900">
                  {remainingCount}
                </span>{" "}
                <span className="text-slate-500">
                  remaining
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-900">
                  {completedCount}
                </span>{" "}
                <span className="text-slate-500">
                  completed
                </span>
              </div>
            </div>

            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-sm font-medium text-red-500 transition hover:text-red-600"
              >
                Clear completed
              </button>
            )}
          </div>

          {/* Todo List */}
          <div className="p-6">

            {todos.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📝
                </div>

                <h2 className="text-lg font-semibold text-slate-800">
                  No tasks yet
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add your first task above to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`group flex items-center gap-3 rounded-2xl border p-4 transition ${
                      todo.completed
                        ? "border-slate-100 bg-slate-50"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
                    }`}
                  >

                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      aria-label={
                        todo.completed
                          ? "Mark task as incomplete"
                          : "Mark task as complete"
                      }
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        todo.completed
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 hover:border-blue-500"
                      }`}
                    >
                      {todo.completed && "✓"}
                    </button>

                    {/* Task */}
                    <span
                      className={`flex-1 text-sm sm:text-base ${
                        todo.completed
                          ? "text-slate-400 line-through"
                          : "text-slate-700"
                      }`}
                    >
                      {todo.text}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 opacity-70 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Built with Next.js and Tailwind CSS
        </p>

      </div>
    </main>
  );
}