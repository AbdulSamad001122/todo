"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTodoPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    async function fetchTodo() {
      try {
        const res = await fetch(`/api/todos/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Task not found");
          throw new Error("Failed to load task details");
        }
        const todo = await res.json();
        setTitle(todo.title || "");
        setDescription(todo.description || "");
      } catch (err: any) {
        setError(err.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    }
    fetchTodo();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError(true);
      setTimeout(() => setFormError(false), 400);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/todos/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const json = await res.json();
      if (json.success) {
        router.push("/");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-all group"
        >
          <svg
            className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-900 shadow-xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Edit Task
          </h1>
          <p className="text-zinc-500 text-xs font-mono">
            ID: {id}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <svg className="animate-spin h-6 w-6 text-zinc-700" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-[10px] text-zinc-600 font-mono">Retrieving details...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs text-center font-mono">
            {error}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`space-y-5 transition-all duration-200 ${
              formError ? "animate-shake border-red-500/50" : ""
            }`}
          >
            <div className="space-y-1.5">
              <label htmlFor="edit-title" className="text-xs font-medium text-zinc-400 font-mono">
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-100 text-sm placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-desc" className="text-xs font-medium text-zinc-400 font-mono">
                Description
              </label>
              <textarea
                id="edit-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some details..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-100 text-sm placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none font-sans"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/"
                className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 font-medium text-sm text-center hover:bg-zinc-900/50 active:scale-[0.98] transition-all cursor-pointer font-sans"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-600/10 cursor-pointer font-sans"
              >
                {submitting ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
