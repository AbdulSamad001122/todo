import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="space-y-6 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400 shadow-xl shadow-black/40">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent sm:text-5xl">
            404
          </h1>
          <h2 className="text-xl font-semibold text-zinc-200">
            Page Not Found
          </h2>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto font-mono">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
