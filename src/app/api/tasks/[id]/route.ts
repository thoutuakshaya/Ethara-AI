import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: { project: true }
  });

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  // Admins, Project Owners, and the Assignee can update the task
  if (
    session.user.role !== "ADMIN" &&
    task.project.ownerId !== session.user.id &&
    task.assigneeId !== session.user.id
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, status, dueDate, assigneeId } = body;

  const updateData: any = {};
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status) updateData.status = status;
  if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
  
  // Only admins or owners can reassign
  if (assigneeId !== undefined) {
    if (session.user.role !== "ADMIN" && task.project.ownerId !== session.user.id) {
       return NextResponse.json({ message: "Only admins or project owners can reassign tasks" }, { status: 403 });
    }
    updateData.assigneeId = assigneeId;
  }

  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: updateData
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: { project: true }
  });

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && task.project.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.task.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ message: "Task deleted" });
}
