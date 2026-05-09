import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { name: true, email: true } },
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
    const isAssigned = project.tasks.some(t => t.assigneeId === session.user.id);
    if (!isAssigned) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json(project);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.project.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ message: "Project deleted" });
}
