
"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
};

type Filter = "All" | "Pending" | "Today" | "Overdue" | "Completed";

export default function Home() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] =
    useState<Todo["priority"]>("Medium");

 const [todos, setTodos] = useState<Todo[]>([]);
const [todosLoaded, setTodosLoaded] = useState(false);

useEffect(() => {
  const savedTodos = localStorage.getItem("taskflow-todos");

  if (savedTodos) {
    setTodos(JSON.parse(savedTodos));
  }

  setTodosLoaded(true);
}, []);

useEffect(() => {
  if (!todosLoaded) return;

  localStorage.setItem(
    "taskflow-todos",
    JSON.stringify(todos)
  );
}, [todos, todosLoaded]);

  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editPriority, setEditPriority] =
    useState<Todo["priority"]>("Medium");

  const menuItems = [
    {
      name: "Dashboard",
      icon: "▦",
    },
    {
      name: "My Tasks",
      icon: "✓",
    },
    {
      name: "Calendar",
      icon: "▣",
    },
    {
      name: "Settings",
      icon: "⚙",
    },
  ];

  const today = new Date().toISOString().split("T")[0];

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  const pendingCount = todos.filter(
    (todo) => !todo.completed
  ).length;

  const todayCount = todos.filter(
    (todo) =>
      todo.dueDate === today &&
      !todo.completed
  ).length;

  const overdueCount = todos.filter(
    (todo) =>
      todo.dueDate &&
      todo.dueDate < today &&
      !todo.completed
  ).length;

  function addTodo() {
    if (!task.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      dueDate,
      priority,
    };

    setTodos([...todos, newTodo]);

    setTask("");
    setDueDate("");
    setPriority("Medium");
  }

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

  function deleteTodo(id: number) {
    setTodos(
      todos.filter((todo) => todo.id !== id)
    );

    if (editingId === id) {
      cancelEdit();
    }
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDate(todo.dueDate);
    setEditPriority(todo.priority);
  }

  function saveEdit() {
    if (!editText.trim() || editingId === null) {
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === editingId
          ? {
              ...todo,
              text: editText.trim(),
              dueDate: editDate,
              priority: editPriority,
            }
          : todo
      )
    );

    cancelEdit();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
    setEditDate("");
    setEditPriority("Medium");
  }

  function clearCompleted() {
    setTodos(
      todos.filter((todo) => !todo.completed)
    );
  }

  function getPriorityStyle(
    priority: Todo["priority"]
  ) {
    if (priority === "High") {
      return "bg-red-100 text-red-600";
    }

    if (priority === "Medium") {
      return "bg-amber-100 text-amber-600";
    }

    return "bg-green-100 text-green-600";
  }

  function getDateLabel(dueDate: string) {
    if (!dueDate) {
      return "No due date";
    }

    if (dueDate === today) {
      return "Today";
    }

    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const tomorrowString = tomorrow
      .toISOString()
      .split("T")[0];

    if (dueDate === tomorrowString) {
      return "Tomorrow";
    }

    if (dueDate < today) {
      return "Overdue";
    }

    return new Date(
      `${dueDate}T00:00:00`
    ).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.text
        .toLowerCase()
        .includes(search.toLowerCase());

    if (!matchesSearch) {
      return false;
    }

    switch (filter) {
      case "Pending":
        return !todo.completed;

      case "Today":
        return (
          todo.dueDate === today &&
          !todo.completed
        );

      case "Overdue":
        return (
          todo.dueDate &&
          todo.dueDate < today &&
          !todo.completed
        );

      case "Completed":
        return todo.completed;

      case "All":
      default:
        return true;
    }
  });

  return (
    <main className="min-h-screen bg-slate-100">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            ✓
          </div>

          <div>
            <h1 className="font-bold text-slate-900">
              TaskFlow
            </h1>

            <p className="text-xs text-slate-400">
              Productivity
            </p>
          </div>

        </div>

        <nav className="p-4">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() =>
                  setActiveMenu(item.name)
                }
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  activeMenu === item.name
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >

                <span className="text-lg">
                  {item.icon}
                </span>

                {item.name}

              </button>
            ))}

          </div>

        </nav>

        {/* PRODUCTIVITY */}

        <div className="absolute bottom-0 w-full border-t border-slate-100 p-4">

          <div className="rounded-2xl bg-slate-50 p-4">

            <p className="text-xs font-medium text-slate-400">
              Completion Rate
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {todos.length === 0
                ? 0
                : Math.round(
                    (completedCount /
                      todos.length) *
                      100
                  )}
              %
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    todos.length === 0
                      ? 0
                      : (completedCount /
                          todos.length) *
                        100
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <div className="lg:ml-64">

        {/* HEADER */}

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            <div>

              <p className="text-sm text-slate-400">
                Personal Productivity
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                {activeMenu}
              </h2>

            </div>

            <div className="flex items-center gap-3">

              <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                🔔
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                RN
              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="p-4 sm:p-6 lg:p-8">

          {/* WELCOME */}

          <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg sm:p-8">

            <p className="text-sm font-medium text-blue-100">
              Good day 👋
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Welcome back!
            </h1>

            <p className="mt-2 text-blue-100">
              Stay organized and make progress today.
            </p>

          </section>


          {/* STATISTICS */}

          <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

              <p className="text-sm text-slate-500">
                Total Tasks
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {todos.length}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {completedCount}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

              <p className="text-sm text-slate-500">
                Today
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {todayCount}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

              <p className="text-sm text-slate-500">
                Overdue
              </p>

              <p className="mt-2 text-3xl font-bold text-red-500">
                {overdueCount}
              </p>

            </div>

          </section>


          {/* ADD TASK */}

          <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <h2 className="font-bold text-slate-900">
              Add a new task
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Create a task with a date and priority.
            </p>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">

              <input
                type="text"
                placeholder="What needs to be done?"
                value={task}
                onChange={(e) =>
                  setTask(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTodo();
                  }
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as Todo["priority"]
                  )
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Low">
                  Low Priority
                </option>

                <option value="Medium">
                  Medium Priority
                </option>

                <option value="High">
                  High Priority
                </option>

              </select>

              <button
                onClick={addTodo}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
              >
                + Add Task
              </button>

            </div>

          </section>


          {/* TASKS */}

          <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">

            {/* TASK HEADER */}

            <div className="border-b border-slate-100 p-6">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <h2 className="font-bold text-slate-900">
                    My Tasks
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Search and manage your tasks.
                  </p>

                </div>


                {/* SEARCH */}

                <input
                  type="text"
                  placeholder="🔎 Search tasks..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 lg:w-64"
                />

              </div>


              {/* FILTERS */}

              <div className="mt-5 flex flex-wrap gap-2">

                {(
                  [
                    "All",
                    "Pending",
                    "Today",
                    "Overdue",
                    "Completed",
                  ] as Filter[]
                ).map((item) => {

                  let count = 0;

                  if (item === "All") {
                    count = todos.length;
                  }

                  if (item === "Pending") {
                    count = pendingCount;
                  }

                  if (item === "Today") {
                    count = todayCount;
                  }

                  if (item === "Overdue") {
                    count = overdueCount;
                  }

                  if (item === "Completed") {
                    count = completedCount;
                  }

                  return (
                    <button
                      key={item}
                      onClick={() =>
                        setFilter(item)
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        filter === item
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {item}

                      <span
                        className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                          filter === item
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        {count}
                      </span>

                    </button>
                  );
                })}

              </div>

            </div>


            {/* TASK LIST */}

            <div className="divide-y divide-slate-100">

              {filteredTodos.length === 0 ? (

                <div className="p-12 text-center">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                    🔎
                  </div>

                  <h3 className="font-semibold text-slate-800">
                    No tasks found
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Try another filter or search term.
                  </p>

                </div>

              ) : (

                filteredTodos.map((todo) => (

                  <div
                    key={todo.id}
                    className="p-5 transition hover:bg-slate-50"
                  >

                    {editingId === todo.id ? (

                      /* EDIT MODE */

                      <div className="space-y-4">

                        <input
                          type="text"
                          value={editText}
                          onChange={(e) =>
                            setEditText(
                              e.target.value
                            )
                          }
                          autoFocus
                          className="w-full rounded-xl border border-blue-300 bg-white px-4 py-3 outline-none ring-4 ring-blue-50"
                        />

                        <div className="grid gap-3 sm:grid-cols-2">

                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) =>
                              setEditDate(
                                e.target.value
                              )
                            }
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                          />

                          <select
                            value={editPriority}
                            onChange={(e) =>
                              setEditPriority(
                                e.target.value as Todo["priority"]
                              )
                            }
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                          >

                            <option value="Low">
                              Low Priority
                            </option>

                            <option value="Medium">
                              Medium Priority
                            </option>

                            <option value="High">
                              High Priority
                            </option>

                          </select>

                        </div>

                        <div className="flex gap-2">

                          <button
                            onClick={saveEdit}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Save Changes
                          </button>

                          <button
                            onClick={cancelEdit}
                            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                          >
                            Cancel
                          </button>

                        </div>

                      </div>

                    ) : (

                      /* NORMAL MODE */

                      <div className="flex items-center gap-4">

                        {/* CHECKBOX */}

                        <button
                          onClick={() =>
                            toggleTodo(todo.id)
                          }
                          aria-label={
                            todo.completed
                              ? "Mark task as incomplete"
                              : "Mark task as complete"
                          }
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            todo.completed
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-slate-300 hover:border-blue-500"
                          }`}
                        >
                          {todo.completed && "✓"}
                        </button>


                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">

                          <p
                            className={`font-medium ${
                              todo.completed
                                ? "text-slate-400 line-through"
                                : "text-slate-700"
                            }`}
                          >
                            {todo.text}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">

                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityStyle(
                                todo.priority
                              )}`}
                            >
                              {todo.priority}
                            </span>

                            <span
                              className={`text-xs ${
                                todo.dueDate < today &&
                                !todo.completed
                                  ? "font-semibold text-red-500"
                                  : "text-slate-400"
                              }`}
                            >
                              📅{" "}
                              {getDateLabel(
                                todo.dueDate
                              )}
                            </span>

                          </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="flex gap-1">

                          <button
                            onClick={() =>
                              startEdit(todo)
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteTodo(todo.id)
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    )}

                  </div>

                ))

              )}

            </div>


            {/* FOOTER */}

            {completedCount > 0 && (

              <div className="flex justify-end border-t border-slate-100 p-4">

                <button
                  onClick={clearCompleted}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Clear completed
                </button>

              </div>

            )}

          </section>


          {/* FOOTER */}

          <p className="mt-8 text-center text-sm text-slate-400">
            TaskFlow • Personal Productivity Dashboard
          </p>

        </div>

      </div>

    </main>
  );
}