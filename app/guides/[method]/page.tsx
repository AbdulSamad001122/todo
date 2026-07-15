import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface GuideContent {
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
}

const guides: Record<string, GuideContent> = {
  gtd: {
    title: "Getting Things Done (GTD)",
    subtitle: "Clear your mind, organize inputs, and focus on action.",
    description: "GTD is a productivity framework created by David Allen. The core principle is that our brains are great for processing ideas, but terrible for holding them. By capturing tasks externally, we free up cognitive resources to focus entirely on execution.",
    steps: [
      "Capture: Record everything that catches your attention in your inbox.",
      "Clarify: Process what you've captured. Decide if it requires action.",
      "Organize: Categorize your actions (e.g. Next Actions, Waiting For, Projects).",
      "Reflect: Review your lists weekly to ensure they are complete and up to date.",
      "Engage: Make smart choices about what action to take in the current context."
    ]
  },
  pomodoro: {
    title: "The Pomodoro Technique",
    subtitle: "Sustain focus and manage mental fatigue using intervals.",
    description: "Developed by Francesco Cirillo in the late 1980s, this method utilizes structured intervals to maintain peak productivity. By committing to highly focused sprint blocks followed by rest periods, it prevents cognitive exhaustion.",
    steps: [
      "Choose a task: Identify the single most important action to work on.",
      "Set a timer: Set your timer for exactly 25 minutes (one Pomodoro).",
      "Focus: Work exclusively on the selected task until the timer rings.",
      "Take a break: Enjoy a short 5-minute break to clear your mind.",
      "Repeat: Every 4 Pomodoros, reward yourself with a longer 20-30 minute break."
    ]
  },
  kanban: {
    title: "Kanban Methodology",
    subtitle: "Visualize your workflow and limit work-in-progress.",
    description: "Originating from Toyota's manufacturing system, Kanban is a visual scheduling system designed to optimize flow. It is built around boards with cards representing tasks and columns representing progress stages, allowing you to spot bottlenecks immediately.",
    steps: [
      "Visualize workflow: Map your workflow steps on a board (To Do, Doing, Done).",
      "Limit WIP (Work In Progress): Limit how many tasks can be in the 'Doing' stage.",
      "Manage flow: Track and analyze tasks as they transition across columns.",
      "Make policies explicit: Ensure team guidelines and standards are clear.",
      "Improve collaboratively: Continuously refine stages based on performance data."
    ]
  }
};

export function generateStaticParams() {
  return [
    { method: "gtd" },
    { method: "pomodoro" },
    { method: "kanban" }
  ];
}

interface PageProps {
  params: Promise<{ method: string }>;
}

export default async function GuidePage({ params }: PageProps) {
  const { method } = await params;
  const guide = guides[method];

  if (!guide) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-8">
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
        <span className="text-[10px] px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">
          SSG + ISR Enabled
        </span>
      </div>

      <div className="flex flex-wrap gap-2 p-1 rounded-xl bg-zinc-900/50 border border-zinc-800 w-fit">
        {Object.keys(guides).map((key) => (
          <Link
            key={key}
            href={`/guides/${key}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              method === key
                ? "bg-zinc-800 text-indigo-400 border border-zinc-700 shadow"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {key === "gtd" ? "GTD" : key}
          </Link>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-900 shadow-xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {guide.title}
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            {guide.subtitle}
          </p>
        </div>

        <p className="text-zinc-500 text-sm leading-relaxed">
          {guide.description}
        </p>

        <div className="space-y-4 pt-4 border-t border-zinc-900">
          <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
            Core Implementation Steps
          </h3>
          <ol className="space-y-3.5">
            {guide.steps.map((step, idx) => {
              const [heading, detail] = step.split(":");
              return (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-center text-xs font-mono font-bold text-indigo-400 shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-200">{heading}</strong>
                    {detail ? ":" + detail : ""}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
