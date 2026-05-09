import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: session.user.role === "ADMIN" ? {} : {
      OR: [
        { ownerId: session.user.id },
        { tasks: { some: { assigneeId: session.user.id } } },
        { members: { some: { id: session.user.id } } }
      ]
    },
    include: {
      owner: { select: { name: true, email: true } },
      members: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can create projects" }, { status: 403 });
  }

  const { name, description } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId: session.user.id
    }
  });

  return NextResponse.json(project, { status: 201 });
}
