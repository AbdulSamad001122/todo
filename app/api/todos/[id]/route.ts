import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const currentTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!currentTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        completed: !currentTodo.completed,
      },
    });

    console.log("Todo updated:", todo);

    revalidatePath("/");

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const todo = await prisma.todo.delete({
      where: { id },
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    revalidatePath("/");

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
