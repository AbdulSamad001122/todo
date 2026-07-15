"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTodoAction(formData: FormData) {
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
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create todo" };
  }
}
