
"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  category:
    | "Work"
    | "Personal"
    | "Learning"
    | "Health"
    | "Other";
};

type Filter =
  | "All"
  | "Pending"
  | "Today"
  | "Overdue"
  | "Completed";

type SortOption =
  | "recent"
  | "dueDate"
  | "priority"
  | "alphabetical";

export default function Home() {
  const [activeMenu, setActiveMenu] =
    useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] =
  useState(false);

  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [priority, setPriority] =
    useState<Todo["priority"]>("Medium");

  const [category, setCategory] =
    useState<Todo["category"]>("Work");

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoaded, setTodosLoaded] =
    useState(false);

  const [filter, setFilter] =
  useState<Filter>("All");

const [sortBy, setSortBy] =
  useState<SortOption>("recent");
  
  

const [search, setSearch] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  

  const [editPriority, setEditPriority] =
    useState<Todo["priority"]>("Medium");

  const [editCategory, setEditCategory] =
    useState<Todo["category"]>("Work");
    

  /*
   * LOAD TASKS FROM LOCAL STORAGE
   */

  useEffect(() => {
    const savedTodos =
      localStorage.getItem("taskflow-todos");

    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(
          savedTodos
        );

        const updatedTodos = parsedTodos.map(
          (todo: Todo) => ({
            ...todo,
            category: todo.category || "Work",
          })
        );

        setTodos(updatedTodos);
      } catch {
        setTodos([]);
      }
    }

    setTodosLoaded(true);
  }, []);

  /*
   * SAVE TASKS TO LOCAL STORAGE
   */

  useEffect(() => {
    if (!todosLoaded) return;

    localStorage.setItem(
      "taskflow-todos",
      JSON.stringify(todos)
    );
  }, [todos, todosLoaded]);

  /*
   * MENU
   */

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

  /*
   * TODAY
   */

  const today = new Date()
    .toISOString()
    .split("T")[0];

  /*
   * STATISTICS
   */

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

  /*
   * ADD TODO
   */

  function addTodo() {
    if (!task.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      dueDate,
      priority,
      category,
    };

    setTodos((currentTodos) => [
      ...currentTodos,
      newTodo,
    ]);

    setTask("");
    setDueDate("");
    setPriority("Medium");
    setCategory("Work");
  }

  /*
   * TOGGLE TODO
   */

  function toggleTodo(id: number) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  }

  /*
   * DELETE TODO
   */

  function deleteTodo(id: number) {
    setTodos((currentTodos) =>
      currentTodos.filter(
        (todo) => todo.id !== id
      )
    );

    if (editingId === id) {
      cancelEdit();
    }
  }

  /*
   * START EDIT
   */

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDate(todo.dueDate);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
  }

  /*
   * SAVE EDIT
   */

  function saveEdit() {
    if (
      !editText.trim() ||
      editingId === null
    ) {
      return;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === editingId
          ? {
              ...todo,
              text: editText.trim(),
              dueDate: editDate,
              priority: editPriority,
              category: editCategory,
            }
          : todo
      )
    );

    cancelEdit();
  }

  /*
   * CANCEL EDIT
   */

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
    setEditDate("");
    setEditPriority("Medium");
    setEditCategory("Work");
  }

  /*
   * CLEAR COMPLETED
   */

  function clearCompleted() {
    setTodos((currentTodos) =>
      currentTodos.filter(
        (todo) => !todo.completed
      )
    );
  }
  function clearAllTasks() {
  if (
    window.confirm(
      "Are you sure you want to delete all tasks?"
    )
  ) {
    setTodos([]);
  }
}

  /*
   * PRIORITY STYLE
   */

  function getPriorityStyle(
    taskPriority: Todo["priority"]
  ) {
    if (taskPriority === "High") {
      return "bg-red-100 text-red-600";
    }

    if (taskPriority === "Medium") {
      return "bg-amber-100 text-amber-600";
    }

    return "bg-green-100 text-green-600";
  }

  /*
   * DATE LABEL
   */

  function getDateLabel(taskDueDate: string) {
  if (!taskDueDate) {
    return "No due date";
  }

  const due = new Date(
    `${taskDueDate}T00:00:00`
  );

  const current = new Date(
    `${today}T00:00:00`
  );

  const difference =
    Math.round(
      (due.getTime() -
        current.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  if (difference < 0) {
    const daysOverdue = Math.abs(
      difference
    );

    return daysOverdue === 1
      ? "1 day overdue"
      : `${daysOverdue} days overdue`;
  }

  if (difference === 0) {
    return "Due today";
  }

  if (difference === 1) {
    return "Due tomorrow";
  }

  if (difference <= 7) {
    return `Due in ${difference} days`;
  }

  return due.toLocaleDateString(
    "en-ZA",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

  /*
   * FILTER TASKS
   */

  const filteredTodos = todos.filter(
    (todo) => {
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
    }
  );
  const sortedTodos = [...filteredTodos].sort(
  (a, b) => {
    switch (sortBy) {
      case "dueDate":
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return (
          a.dueDate.localeCompare(
            b.dueDate
          )
        );

      case "priority": {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
        );
      }

      case "alphabetical":
        return a.text.localeCompare(
          b.text
        );

      case "recent":
      default:
        return b.id - a.id;
    }
  }
);

  /*
   * COMPLETION RATE
   */

  const completionRate =
    todos.length === 0
      ? 0
      : Math.round(
          (completedCount /
            todos.length) *
            100
        );

  /*
   * CATEGORY DATA
   */

  const categories = [
    {
      name: "Work" as const,
      icon: "💼",
    },
    {
      name: "Personal" as const,
      icon: "🏠",
    },
    {
      name: "Learning" as const,
      icon: "📚",
    },
    {
      name: "Health" as const,
      icon: "❤️",
    },
    {
      name: "Other" as const,
      icon: "📌",
    },
  ];

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
                onClick={() => {
                setActiveMenu(item.name);
                setMobileMenuOpen(false);
                }}
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

        {/* COMPLETION RATE */}

        <div className="absolute bottom-0 w-full border-t border-slate-100 p-4">

          <div className="rounded-2xl bg-slate-50 p-4">

            <p className="text-xs font-medium text-slate-400">
              Completion Rate
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {completionRate}%
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${completionRate}%`,
                }}
              />

            </div>

          </div>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <div className="lg:ml-64">

        {/* HEADER */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">

  <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

    {/* MOBILE MENU BUTTON */}

    <div className="flex items-center gap-3">

      <button
        onClick={() =>
          setMobileMenuOpen(
            !mobileMenuOpen
          )
        }
        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation menu"
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* MOBILE LOGO */}

      <div className="flex items-center gap-2 lg:hidden">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
          ✓
        </div>

        <div>
          <p className="font-bold leading-none text-slate-900">
            TaskFlow
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Productivity
          </p>
        </div>

      </div>

      {/* DESKTOP PAGE TITLE */}

      <div className="hidden lg:block">

        <p className="text-sm text-slate-400">
          Personal Productivity
        </p>

        <h2 className="text-xl font-bold text-slate-900">
          {activeMenu}
        </h2>

      </div>

    </div>


    {/* RIGHT SIDE */}

    <div className="flex items-center gap-3">

      <button
        className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Notifications"
      >
        🔔
      </button>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
        RN
      </div>

    </div>

  </div>


  {/* MOBILE MENU */}

  {mobileMenuOpen && (

    <div className="border-t border-slate-100 bg-white px-4 pb-4 lg:hidden">

      <div className="space-y-1 pt-3">

        {menuItems.map((item) => (

          <button
            key={item.name}
            onClick={() => {
              setActiveMenu(item.name);
              setMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
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

    </div>

  )}

</header>


        {/* PAGE CONTENT */}

        <div className="p-4 sm:p-6 lg:p-8">

          {/* WELCOME BANNER */}

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


          {/* CATEGORY OVERVIEW */}

          <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <div className="mb-5">

              <h2 className="font-bold text-slate-900">
                Task Categories
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                See where your time and attention are going.
              </p>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

              {categories.map((categoryItem) => {

                const count = todos.filter(
                  (todo) =>
                    todo.category ===
                    categoryItem.name
                ).length;

                return (
                  <div
                    key={categoryItem.name}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xl">
                        {categoryItem.icon}
                      </span>

                      <span className="text-2xl font-bold text-slate-900">
                        {count}
                      </span>

                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      {categoryItem.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {count === 1
                        ? "task"
                        : "tasks"}
                    </p>

                  </div>
                );
              })}

            </div>

          </section>


          {/* ADD TASK */}

          <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <h2 className="font-bold text-slate-900">
              Add a new task
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Create a task with a date, priority and category.
            </p>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">

              {/* TASK */}

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


              {/* DATE */}

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />


              {/* PRIORITY */}

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


              {/* CATEGORY */}

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as Todo["category"]
                  )
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Work">
                  💼 Work
                </option>

                <option value="Personal">
                  🏠 Personal
                </option>

                <option value="Learning">
                  📚 Learning
                </option>

                <option value="Health">
                  ❤️ Health
                </option>

                <option value="Other">
                  📌 Other
                </option>
              </select>


              {/* ADD BUTTON */}

              <button
                onClick={addTodo}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
              >
                + Add Task
              </button>

            </div>

          </section>


          {/* TASK LIST */}

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
                <select
  value={sortBy}
  onChange={(e) =>
    setSortBy(
      e.target.value as SortOption
    )
  }
  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
>
  <option value="recent">
    Recently Added
  </option>

  <option value="dueDate">
    Due Date
  </option>

  <option value="priority">
    Priority
  </option>

  <option value="alphabetical">
    Alphabetical
  </option>
</select>

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
                ).map((filterItem) => {

                  let count = 0;

                  if (filterItem === "All") {
                    count = todos.length;
                  }

                  if (
                    filterItem ===
                    "Pending"
                  ) {
                    count = pendingCount;
                  }

                  if (
                    filterItem ===
                    "Today"
                  ) {
                    count = todayCount;
                  }

                  if (
                    filterItem ===
                    "Overdue"
                  ) {
                    count = overdueCount;
                  }

                  if (
                    filterItem ===
                    "Completed"
                  ) {
                    count = completedCount;
                  }

                  return (
                    <button
                      key={filterItem}
                      onClick={() =>
                        setFilter(
                          filterItem
                        )
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        filter ===
                        filterItem
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >

                      {filterItem}

                      <span
                        className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                          filter ===
                          filterItem
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


            {/* TASKS */}

            <div className="divide-y divide-slate-100">

              {filteredTodos.length === 0 ? (

                <div className="p-12 text-center">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                    📝
                  </div>

                  <h3 className="font-semibold text-slate-800">
                    No tasks found
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Try another filter or add a new task.
                  </p>

                </div>

              ) : (

                sortedTodos.map(
                   (todo) => (

                    <div
                      key={todo.id}
                      className="p-5 transition hover:bg-slate-50"
                    >

                      {editingId ===
                      todo.id ? (

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

                          <div className="grid gap-3 sm:grid-cols-3">

                            {/* EDIT DATE */}

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


                            {/* EDIT PRIORITY */}

                            <select
                              value={
                                editPriority
                              }
                              onChange={(e) =>
                                setEditPriority(
                                  e.target
                                    .value as Todo["priority"]
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


                            {/* EDIT CATEGORY */}

                            <select
                              value={
                                editCategory
                              }
                              onChange={(e) =>
                                setEditCategory(
                                  e.target
                                    .value as Todo["category"]
                                )
                              }
                              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            >

                              <option value="Work">
                                💼 Work
                              </option>

                              <option value="Personal">
                                🏠 Personal
                              </option>

                              <option value="Learning">
                                📚 Learning
                              </option>

                              <option value="Health">
                                ❤️ Health
                              </option>

                              <option value="Other">
                                📌 Other
                              </option>

                            </select>

                          </div>


                          {/* EDIT BUTTONS */}

                          <div className="flex gap-2">

                            <button
                              onClick={
                                saveEdit
                              }
                              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              Save Changes
                            </button>

                            <button
                              onClick={
                                cancelEdit
                              }
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
                              toggleTodo(
                                todo.id
                              )
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
                            {todo.completed &&
                              "✓"}
                          </button>


                          {/* TASK DETAILS */}

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

                              {/* PRIORITY */}

                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityStyle(
                                  todo.priority
                                )}`}
                              >
                                {todo.priority}
                              </span>


                              {/* CATEGORY */}

                              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                                {todo.category}
                              </span>


                              {/* DATE */}

                              <span
  className={`text-xs ${
    !todo.completed &&
    todo.dueDate < today
      ? "font-semibold text-red-500"
      : !todo.completed &&
        todo.dueDate === today
      ? "font-semibold text-orange-500"
      : !todo.completed &&
        todo.dueDate
      ? "text-blue-500"
      : "text-slate-400"
  }`}
>
  📅 {getDateLabel(todo.dueDate)}
</span>

                            </div>

                          </div>


                          {/* ACTIONS */}

                          <div className="flex gap-1">

                            <button
                              onClick={() =>
                                startEdit(
                                  todo
                                )
                              }
                              className="rounded-lg px-3 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50 hover:text-blue-600"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteTodo(
                                  todo.id
                                )
                              }
                              className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      )}

                    </div>

                  )
                )

              )}

            </div>


            {/* CLEAR COMPLETED */}

            <div className="flex flex-wrap justify-end gap-4 border-t border-slate-100 p-4">

  {completedCount > 0 && (
    <button
      onClick={clearCompleted}
      className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
    >
      Clear completed
    </button>
  )}

  {todos.length > 0 && (
    <button
      onClick={clearAllTasks}
      className="text-sm font-medium text-red-500 transition hover:text-red-600"
    >
      Clear all tasks
    </button>
  )}

</div>

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