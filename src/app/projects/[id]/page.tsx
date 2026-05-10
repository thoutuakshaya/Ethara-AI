"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Clock, Layout, BarChart3, Users, Target, ArrowRight } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string | null;
  assignee: User | null;
  assigneeId: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  tasks: Task[];
  members: User[];
}

export default function ProjectDetails() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const [memberToAdd, setMemberToAdd] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setProject(data);
    } catch (err) {
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      setUsers(await res.json());
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProject();
      fetchUsers();
    }
  }, [status, params.id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTask ? `/api/tasks/${editingTask.id}` : `/api/projects/${params.id}/tasks`;
    const method = editingTask ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        description, 
        dueDate: dueDate || null, 
        assigneeId: assigneeId || null 
      })
    });
    if (res.ok) {
      setShowCreate(false);
      setEditingTask(null);
      setTitle("");
      setDescription("");
      setDueDate("");
      setAssigneeId("");
      fetchProject();
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : "");
    setAssigneeId(task.assigneeId || "");
    setShowCreate(true);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    fetchProject();
  };

  const handleAssignMember = async () => {
    if (!memberToAdd) return;
    await fetch(`/api/projects/${params.id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: memberToAdd })
    });
    setMemberToAdd("");
    fetchProject();
  };

  const handleRemoveMember = async (userId: string) => {
    await fetch(`/api/projects/${params.id}/assign`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    fetchProject();
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  if (!project) return null;

  const isAdminOrOwner = session?.user.role === "ADMIN" || project.ownerId === session?.user.id;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        <p className="mt-2 text-gray-600">{project.description}</p>
      </div>

      {isAdminOrOwner && (
        <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Project Members</h2>
          <div className="flex gap-4 mb-4">
            <select
              value={memberToAdd}
              onChange={(e) => setMemberToAdd(e.target.value)}
              className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
            >
              <option value="">Select a member to add</option>
              {users.filter(u => !project.members.some(m => m.id === u.id)).map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <button
              onClick={handleAssignMember}
              disabled={!memberToAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Add Member
            </button>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {project.members.map(member => (
              <li key={member.id} className="py-3 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{member.name} ({member.email})</span>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
            {project.members.length === 0 && (
              <li className="py-3 text-sm text-gray-500">No members explicitly assigned.</li>
            )}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
        {isAdminOrOwner && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Add Task
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO Column */}
        <div className="kanban-column">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">To Do</h3>
            <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {project.tasks.filter(t => t.status === 'TODO').length}
            </span>
          </div>
          {project.tasks.filter(t => t.status === 'TODO').map(task => (
            <KanbanCard key={task.id} task={task} isAdmin={isAdminOrOwner} onEdit={openEdit} onStatusChange={handleUpdateStatus} session={session} />
          ))}
        </div>

        {/* IN PROGRESS Column */}
        <div className="kanban-column">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">In Progress</h3>
            <span className="bg-amber-100 dark:bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {project.tasks.filter(t => t.status === 'IN_PROGRESS').length}
            </span>
          </div>
          {project.tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
            <KanbanCard key={task.id} task={task} isAdmin={isAdminOrOwner} onEdit={openEdit} onStatusChange={handleUpdateStatus} session={session} />
          ))}
        </div>

        {/* DONE Column */}
        <div className="kanban-column">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Done</h3>
            <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {project.tasks.filter(t => t.status === 'DONE').length}
            </span>
          </div>
          {project.tasks.filter(t => t.status === 'DONE').map(task => (
            <KanbanCard key={task.id} task={task} isAdmin={isAdminOrOwner} onEdit={openEdit} onStatusChange={handleUpdateStatus} session={session} />
          ))}
        </div>
      </div>
    </div>
  );
}

function KanbanCard({ task, isAdmin, onEdit, onStatusChange, session }: { task: Task, isAdmin: boolean, onEdit: (t: Task) => void, onStatusChange: (id: string, s: string) => void, session: any }) {
  const isAssignee = task.assignee?.email === session?.user?.email;
  const canChangeStatus = isAssignee || (!task.assigneeId && isAdmin);

  return (
    <div className="kanban-card group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h4>
        {isAdmin && (
          <button onClick={() => onEdit(task)} className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
            <Clock className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
        {task.description}
      </p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex -space-x-2">
          {task.assignee ? (
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-600" title={task.assignee.name}>
              {task.assignee.name.charAt(0)}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
              ?
            </div>
          )}
        </div>
        {canChangeStatus ? (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-[10px] font-bold bg-slate-50 dark:bg-slate-900 border-none rounded-lg p-1 cursor-pointer focus:ring-0"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        ) : (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {task.status.replace('_', ' ')}
          </span>
        )}
      </div>
    </div>
  );
}
