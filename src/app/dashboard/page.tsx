"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, CheckCircle2, Clock, AlertCircle, FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
  };
  projects: {
    total: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Live</span>
        </div>
      </div>
      
      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2rem] border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Workflow Analytics</h2>
            <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-bold p-2 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-2">
            {[45, 60, 35, 80, 55, 90, 70].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div 
                  className="w-full bg-indigo-600/20 dark:bg-indigo-600/10 rounded-t-lg relative group transition-all"
                  style={{ height: `${val}%` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-lg transition-all duration-1000 group-hover:bg-indigo-400" 
                    style={{ height: `${val}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">
                    {val}%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col justify-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center">Status Distribution</h2>
          <div className="space-y-6">
            <StatRow label="Completed" val={stats?.tasks.completed || 0} total={stats?.tasks.total || 1} color="bg-emerald-500" />
            <StatRow label="In Progress" val={stats?.tasks.inProgress || 0} total={stats?.tasks.total || 1} color="bg-amber-500" />
            <StatRow label="To Do" val={stats?.tasks.todo || 0} total={stats?.tasks.total || 1} color="bg-slate-400" />
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <QuickStat icon={<ClipboardList className="w-5 h-5" />} label="Total Tasks" value={stats?.tasks.total} color="text-indigo-600" />
        <QuickStat icon={<CheckCircle2 className="w-5 h-5" />} label="Completed" value={stats?.tasks.completed} color="text-emerald-500" />
        <QuickStat icon={<Clock className="w-5 h-5" />} label="Active" value={stats?.tasks.inProgress} color="text-amber-500" />
        <QuickStat icon={<FolderKanban className="w-5 h-5" />} label="Projects" value={stats?.projects.total} color="text-rose-500" />
      </div>
      
      <div className="flex justify-end">
        <Link href="/projects" className="btn-primary flex items-center px-8">
          View Projects <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div className="glass p-6 rounded-3xl border-white/5">
      <div className={`p-2 w-fit rounded-xl bg-slate-50 dark:bg-slate-900 ${color} mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value || 0}</p>
    </div>
  );
}

function StatRow({ label, val, total, color }: { label: string, val: number, total: number, color: string }) {
  const percent = Math.round((val / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

