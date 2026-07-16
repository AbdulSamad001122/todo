import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Dashboard from "./components/Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedTodos = todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }));

  return (
    <div className="w-full">
      <div className="mb-8 space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Manage Your Tasks
        </h1>
        <p className="text-zinc-500 text-sm">
          A minimalist interface to track progress and organize daily objectives.
        </p>
      </div>
      <Dashboard initialTodos={serializedTodos} />
    </div>
  );
}
