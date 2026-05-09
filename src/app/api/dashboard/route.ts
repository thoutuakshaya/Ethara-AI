import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  // Get tasks based on role
  const tasksWhereClause = isAdmin ? {} : { assigneeId: userId };
  const projectsWhereClause = isAdmin ? {} : {
    OR: [
      { ownerId: userId },
      { tasks: { some: { assigneeId: userId } } }
    ]
  };

  const [totalTasks, completedTasks, inProgressTasks, todoTasks, overdueTasks, totalProjects] = await Promise.all([
    prisma.task.count({ where: tasksWhereClause }),
    prisma.task.count({ where: { ...tasksWhereClause, status: "DONE" } }),
    prisma.task.count({ where: { ...tasksWhereClause, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { ...tasksWhereClause, status: "TODO" } }),
    prisma.task.count({
      where: {
        ...tasksWhereClause,
        status: { not: "DONE" },
        dueDate: { lt: new Date() }
      }
    }),
    prisma.project.count({ where: projectsWhereClause })
  ]);

  return NextResponse.json({
    tasks: {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      overdue: overdueTasks,
    },
    projects: {
      total: totalProjects
    }
  });
}
