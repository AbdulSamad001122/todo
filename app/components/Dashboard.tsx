"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createTodoAction } from "@/app/actions/todoActions";

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
}

interface DashboardProps {
  initialTodos: Todo[];
}

export default function Dashboard({ initialTodos }: DashboardProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const formRef = useRef<HTMLFormElement>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const handleSubmitAction = async (formData: FormData) => {
    if (!title.trim()) {
      setFormError(true);
      setTimeout(() => setFormError(false), 400);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await createTodoAction(formData);
      if (result.success) {
        setTitle("");
        setDescription("");
        formRef.current?.reset();
      } else {
        setErrorMessage(result.error || "Failed to create task");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
    } catch (err: any) {
      const res = await fetch("/api/todos");
      const json = await res.json();
      if (json.success) setTodos(json.data);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");
    } catch (err: any) {
      const res = await fetch("/api/todos");
      const json = await res.json();
      if (json.success) setTodos(json.data);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      (todo.description || "").toLowerCase().includes(search.toLowerCase());

    if (filter === "completed") return matchesSearch && todo.completed;
    if (filter === "active") return matchesSearch && !todo.completed;
    return matchesSearch;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-10">
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm shadow-xl">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Total Tasks</p>
            <p className="text-3xl font-semibold tracking-tight text-zinc-100">{totalCount}</p>
          </div>
          <div className="space-y-1 border-x border-zinc-800">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Active</p>
            <p className="text-3xl font-semibold tracking-tight text-indigo-400">{activeCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Completed</p>
            <p className="text-3xl font-semibold tracking-tight text-emerald-400">{completedCount}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-medium text-zinc-400">
            <span>Task Completion</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-tight text-zinc-100">Create New Task</h2>
            <Link
              href="/guides/gtd"
              className="text-xs font-mono text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              Methodology Guides
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <form
            ref={formRef}
            action={handleSubmitAction}
            className={`p-5 rounded-2xl bg-zinc-900/30 border border-zinc-900 space-y-4 transition-all duration-200 ${
              formError ? "animate-shake border-red-500/50" : ""
            }`}
          >
            {errorMessage && (
              <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex justify-between items-center font-mono animate-in fade-in slide-in-from-top-1 duration-200">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400/50 hover:text-red-400 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-medium text-zinc-400">
                Task Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-medium text-zinc-400">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some details..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              {submitting ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>Add Task</>
              )}
            </button>
          </form>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-medium tracking-tight text-zinc-100">Tasks</h2>
            
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-600 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-900 w-fit">
            {(["all", "active", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-zinc-900 text-indigo-400 border border-zinc-800 shadow"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredTodos.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <p className="text-zinc-400 font-medium text-sm">No tasks matched your filter</p>
              <p className="text-zinc-600 text-xs font-mono">Create a task or clear filter options.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 shadow-sm bg-zinc-900/20 ${
                    todo.completed
                      ? "border-zinc-950/60 bg-zinc-950/20"
                      : "border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <button
                    onClick={() => handleToggle(todo.id)}
                    className={`mt-1 w-5.5 h-5.5 rounded-md flex items-center justify-center border transition-all cursor-pointer shadow-sm ${
                      todo.completed
                        ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-400"
                        : "border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-transparent"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-medium tracking-tight truncate transition-all duration-300 ${
                          todo.completed ? "text-zinc-600 line-through decoration-zinc-800" : "text-zinc-100"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                          todo.completed
                            ? "bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/15"
                            : "bg-indigo-500/10 text-indigo-400/80 border border-indigo-500/15"
                        }`}
                      >
                        {todo.completed ? "completed" : "active"}
                      </span>
                    </div>

                    {todo.description && (
                      <p
                        className={`text-xs leading-relaxed transition-all duration-300 truncate ${
                          todo.completed ? "text-zinc-700" : "text-zinc-400"
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/edit/${todo.id}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/5 border border-transparent hover:border-indigo-500/10 transition-all"
                      title="Edit task"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => setTodoToDelete(todo)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
                      title="Delete task"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {todoToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-zinc-100">Delete Task</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">
                Are you sure you want to delete <span className="text-zinc-200 font-medium font-sans">"{todoToDelete.title}"</span>?
              </p>
              <p className="text-xs text-zinc-500 font-mono">
                This action is permanent and cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setTodoToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-zinc-800 text-zinc-400 font-medium text-xs text-center hover:bg-zinc-900/50 active:scale-[0.98] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteConfirm(todoToDelete.id);
                  setTodoToDelete(null);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs hover:shadow-lg hover:shadow-red-600/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
