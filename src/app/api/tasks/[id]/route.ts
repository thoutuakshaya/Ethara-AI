import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id: resolvedParams.id },
    include: { project: { include: { members: true } }, assignee: true }
  });

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const { status, title, description, assigneeId, dueDate } = await req.json();

  const isAssignee = task.assignee?.email === session.user.email;
  const isOwner = task.project.ownerId === session.user.id || task.project.ownerId === session.user.email; 
  const isAdmin = session.user.role === "ADMIN";
  
  // Permission logic
  if (status && !title && !description && !assigneeId && !dueDate) {
    // If only status is being updated (common case for members)
    const canChangeStatus = isAssignee || (!task.assigneeId && (isAdmin || isOwner));
    if (!canChangeStatus) {
      return NextResponse.json({ message: "Forbidden: Status can only be changed by assignee once assigned" }, { status: 403 });
    }
  } else {
    // If other details are being updated
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden: Only Admins/Owners can edit task details" }, { status: 403 });
    }
  }

  const updateData: any = {};
  if (status) updateData.status = status;
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null;
  if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

  const updatedTask = await prisma.task.update({
    where: { id: resolvedParams.id },
    data: updateData
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id: resolvedParams.id },
    include: { project: true }
  });

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && task.project.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.task.delete({
    where: { id: resolvedParams.id }
  });

  return NextResponse.json({ message: "Task deleted" });
}
