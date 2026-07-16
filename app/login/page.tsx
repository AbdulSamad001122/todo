"use client";

import React, { useState, useActionState } from "react";
import { authenticateAction } from "@/app/actions/authActions";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [state, formAction, isPending] = useActionState(
    authenticateAction,
    null
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto">
            <span className="text-white text-lg font-bold font-mono">✓</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {isSignUp ? "Create your account" : "Sign in to AetherTodo"}
          </h2>
          <p className="text-sm text-zinc-500 font-mono">
            {isSignUp
              ? "Join us to organize your tasks beautifully."
              : "Welcome back! Please enter your details."}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-900 backdrop-blur-md shadow-2xl space-y-6">
          {state?.error && (
            <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono text-center animate-in fade-in slide-in-from-top-1 duration-200">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="intent" value={isSignUp ? "signup" : "login"} />
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-medium text-zinc-400 font-mono">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-100 text-sm placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-zinc-400 font-mono">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-100 text-sm placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-600/10 cursor-pointer font-sans"
            >
              {isPending ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>{isSignUp ? "Create Account" : "Sign In"}</>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
              }}
              className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors font-mono cursor-pointer"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
