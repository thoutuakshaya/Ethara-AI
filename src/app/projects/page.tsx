"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Folder } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  owner: { name: string; email: string };
  _count: { tasks: number };
}

export default function Projects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchProjects = () => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description })
    });
    if (res.ok) {
      setShowCreate(false);
      setName("");
      setDescription("");
      fetchProjects();
    }
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {session?.user.role === "ADMIN" && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" /> New Project
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Create New Project</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div className="flex justify-end space-x-3">
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
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors cursor-pointer p-6">
              <div className="flex items-center">
                <Folder className="h-8 w-8 text-indigo-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900 truncate">{project.name}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description || "No description provided."}</p>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>By {project.owner?.name || 'Unknown'}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{project._count?.tasks} tasks</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}
