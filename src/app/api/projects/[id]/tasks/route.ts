import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title, description, assigneeId, dueDate } = await req.json();

  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && project.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Only admins or project owners can create tasks" }, { status: 403 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      assigneeId,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId: resolvedParams.id,
    }
  });

  return NextResponse.json(task, { status: 201 });
}
