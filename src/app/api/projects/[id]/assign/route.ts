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

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && project.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "userId is required" }, { status: 400 });
  }

  const updatedProject = await prisma.project.update({
    where: { id: resolvedParams.id },
    data: {
      members: {
        connect: { id: userId }
      }
    },
    include: {
      members: { select: { id: true, name: true, email: true } }
    }
  });

  return NextResponse.json(updatedProject);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && project.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "userId is required" }, { status: 400 });
  }

  const updatedProject = await prisma.project.update({
    where: { id: params.id },
    data: {
      members: {
        disconnect: { id: userId }
      }
    },
    include: {
      members: { select: { id: true, name: true, email: true } }
    }
  });

  return NextResponse.json(updatedProject);
}
