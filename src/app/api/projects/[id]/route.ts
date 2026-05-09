import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: {
      owner: { select: { name: true, email: true } },
      members: { select: { id: true, name: true, email: true } },
      tasks: {
        include: {
          assignee: { select: { name: true, email: true, id: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  // Access control
  if (session.user.role !== "ADMIN" && project.ownerId !== session.user.id) {
    const isAssignedToTask = project.tasks.some(t => t.assigneeId === session.user.id);
    const isMember = project.members.some(m => m.id === session.user.id);
    if (!isAssignedToTask && !isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json(project);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.project.delete({
    where: { id: resolvedParams.id }
  });

  return NextResponse.json({ message: "Project deleted" });
}
