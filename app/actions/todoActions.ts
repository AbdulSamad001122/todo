"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function createTodoAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "You must be logged in to create a task" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || !title.trim()) {
    return { success: false, error: "Title is required" };
  }

  try {
    await prisma.todo.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        userId: session.userId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create todo" };
  }
}
