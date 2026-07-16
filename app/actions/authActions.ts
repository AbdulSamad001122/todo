"use server";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signupAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !username.trim() || !password) {
    return { success: false, error: "Username and password are required" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (existingUser) {
      return { success: false, error: "Username is already taken" };
    }

    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
      },
    });

    await createSession(user.id);
  } catch (error: any) {
    return { success: false, error: error.message || "An error occurred during sign up" };
  }

  redirect("/");
}

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !username.trim() || !password) {
    return { success: false, error: "Username and password are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid username or password" };
    }

    await createSession(user.id);
  } catch (error: any) {
    return { success: false, error: error.message || "An error occurred during login" };
  }

  redirect("/");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function authenticateAction(prevState: any, formData: FormData) {
  const intent = formData.get("intent") as string;
  if (intent === "signup") {
    return signupAction(prevState, formData);
  }
  return loginAction(prevState, formData);
}
