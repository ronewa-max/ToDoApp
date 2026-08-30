
"use client";

import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
};

type Filter = "all" | "active" | "completed";

export default function Home() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  // Get today's date
  function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Add Todo
  function addTodo() {
    if (!task.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      dueDate,
    };

    setTodos([...todos, newTodo]);
    setTask("");
    setDueDate("");
  }

  // Start editing
  function editTodo(id: number) {
    const todoToEdit = todos.find((todo) => todo.id === id);

    if (!todoToEdit) return;

    setTask(todoToEdit.text);
    setDueDate(todoToEdit.dueDate);
    setEditingId(id);
  }

  // Save edited Todo
  function saveTodo() {
    if (!task.trim() || editingId === null) return;

    setTodos(
      todos.map((todo) =>
        todo.id === editingId
          ? {
              ...todo,
              text: task.trim(),
              dueDate,
            }
          : todo
      )
    );

    setTask("");
    setDueDate("");
    setEditingId(null);
  }

  // Cancel editing
  function cancelEdit() {
    setTask("");
    setDueDate("");
    setEditingId(null);
  }

  // Complete / uncomplete
  function toggleTodo(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  }

  // Delete Todo
  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));

    if (editingId === id) {
      cancelEdit();
    }
  }

  // Clear completed
  function clearCompleted() {
    setTodos(todos.filter((todo) => !todo.completed));
  }

  // Determine task status
  function getTodoStatus(
    todo: Todo
  ): "completed" | "today" | "overdue" | "pending" {
    if (todo.completed) {
      return "completed";
    }

    if (!todo.dueDate) {
      return "pending";
    }

    const today = getTodayDate();

    if (todo.dueDate === today) {
      return "today";
    }

    if (todo.dueDate < today) {
      return "overdue";
    }

    return "pending";
  }

  // Format date
  function formatDate(date: string) {
    if (!date) return "";

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // Filter Todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

  // Statistics
  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  const remainingCount = todos.length - completedCount;

  const overdueCount = todos.filter(
    (todo) => getTodoStatus(todo) === "overdue"
  ).length;

  const todayCount = todos.filter(
    (todo) => getTodoStatus(todo) === "today"
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">

        {/* =========================
            APP BANNER
        ========================== */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-xl sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Logo + App Name */}
            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-sm backdrop-blur">
                ✓
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  My Todo List
                </h1>

                <p className="mt-1 text-sm text-blue-100 sm:text-base">
                  Stay organized, manage your time, and get things done.
                </p>
              </div>

            </div>

            {/* Today's Date */}
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur sm:text-right">

              <p className="text-xs font-medium uppercase tracking-wide text-blue-100">
                Today
              </p>

              <p className="mt-1 font-semibold">
                {new Date().toLocaleDateString("en-ZA", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            STATISTICS
        ========================== */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {todos.length}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-600">
              {remainingCount}
            </p>
          </div>

          {/* Today */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Today
            </p>

            <p className="mt-1 text-2xl font-bold text-amber-500">
              {todayCount}
            </p>
          </div>

          {/* Overdue */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Overdue
            </p>

            <p className="mt-1 text-2xl font-bold text-red-500">
              {overdueCount}
            </p>
          </div>

        </div>

        {/* =========================
            MAIN TODO CARD
        ========================== */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">

          {/* =========================
              ADD / EDIT TODO
          ========================== */}
          <div className="border-b border-slate-100 p-6">

            {editingId !== null && (
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Editing task
              </div>
            )}

            {/* Task Input */}
            <input
              type="text"
              placeholder={
                editingId !== null
                  ? "Edit your task..."
                  : "What needs to be done?"
              }
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  if (editingId !== null) {
                    saveTodo();
                  } else {
                    addTodo();
                  }
                }

                if (
                  e.key === "Escape" &&
                  editingId !== null
                ) {
                  cancelEdit();
                }

              }}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Due Date */}
              <div className="flex-1">

                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Due date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                  min={getTodayDate()}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* Buttons */}
              <div className="flex items-end gap-2">

                <button
                  onClick={
                    editingId !== null
                      ? saveTodo
                      : addTodo
                  }
                  disabled={!task.trim()}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Add Task"}
                </button>

                {editingId !== null && (
                  <button
                    onClick={cancelEdit}
                    className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}

              </div>

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Press Enter to{" "}
              {editingId !== null ? "save" : "add"} a task.
            </p>

          </div>

          {/* =========================
              FILTERS
          ========================== */}
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">

              <button
                onClick={() => setFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter("active")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === "active"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Active
              </button>

              <button
                onClick={() => setFilter("completed")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === "completed"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Completed
              </button>

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

          {/* =========================
              TODO LIST
          ========================== */}
          <div className="p-6">

            {filteredTodos.length === 0 ? (

              <div className="py-12 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  {filter === "completed"
                    ? "🎉"
                    : "📝"}
                </div>

                <h2 className="text-lg font-semibold text-slate-800">

                  {filter === "completed"
                    ? "No completed tasks"
                    : filter === "active"
                    ? "No active tasks"
                    : "No tasks yet"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {filter === "completed"
                    ? "Complete a task and it will appear here."
                    : filter === "active"
                    ? "You're all caught up!"
                    : "Add your first task above to get started."}

                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {filteredTodos.map((todo) => {

                  const status = getTodoStatus(todo);

                  return (

                    <div
                      key={todo.id}
                      className={`group rounded-2xl border p-4 transition ${
                        status === "overdue"
                          ? "border-red-200 bg-red-50/50"
                          : todo.completed
                          ? "border-slate-100 bg-slate-50"
                          : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        {/* Checkbox */}
                        <button
                          onClick={() =>
                            toggleTodo(todo.id)
                          }
                          aria-label={
                            todo.completed
                              ? "Mark task as incomplete"
                              : "Mark task as complete"
                          }
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                            todo.completed
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 hover:border-blue-500"
                          }`}
                        >
                          {todo.completed && "✓"}
                        </button>

                        {/* Task Information */}
                        <div className="min-w-0 flex-1">

                          <p
                            className={`break-words text-sm sm:text-base ${
                              todo.completed
                                ? "text-slate-400 line-through"
                                : "text-slate-700"
                            }`}
                          >
                            {todo.text}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">

                            {todo.dueDate && (
                              <span className="text-xs text-slate-500">
                                📅 {formatDate(todo.dueDate)}
                              </span>
                            )}

                            {!todo.completed &&
                              status === "today" && (
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                                  Today
                                </span>
                              )}

                            {!todo.completed &&
                              status === "pending" && (
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                                  Pending
                                </span>
                              )}

                            {!todo.completed &&
                              status === "overdue" && (
                                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                  Overdue
                                </span>
                              )}

                            {todo.completed && (
                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                Completed
                              </span>
                            )}

                          </div>

                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-1">

                          <button
                            onClick={() =>
                              editTodo(todo.id)
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50 hover:text-blue-600 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteTodo(todo.id)
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  );
                })}

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