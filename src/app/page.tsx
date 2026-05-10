import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Users, Rocket, Zap, Target, BarChart3, Clock, Layout } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Professional Background */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20 scale-105"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-[2px] -z-10" />
        
        {/* Abstract "Slide Bars" / Progress Indicators */}
        <div className="absolute top-[15%] right-[10%] w-64 glass p-6 rounded-2xl hidden lg:block animate-float">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Live Activity</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-4">
            {[75, 45, 90].map((val, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>Project Phase {i + 1}</span>
                  <span>{val}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-[#0F172A] shadow-2xl">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8L8 12L16 16L24 12L16 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 16L16 20L24 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 20L16 24L24 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl leading-[1.1] drop-shadow-2xl">
            Streamline Your <span className="text-indigo-400">Team Workflow</span>
          </h1>
          
          <p className="mt-8 text-xl leading-8 text-slate-200 max-w-2xl mx-auto font-medium drop-shadow-lg">
            TaskFlow is the elite project management suite built for speed. 
            Coordinate, track, and deliver excellence in every sprint.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-indigo-500/40 hover:bg-indigo-500 hover:scale-105 transition-all w-full sm:w-auto"
            >
              Start Free Workspace
            </Link>
            <Link 
              href="/login" 
              className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center"
            >
              Member Login <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 sm:py-32 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureItem 
              icon={<Layout className="w-6 h-6" />}
              title="Intuitive Boards"
              description="Manage tasks with drag-and-drop ease. Stay focused on what matters."
            />
            <FeatureItem 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-time Analytics"
              description="Track team performance with beautiful, automated reports and charts."
            />
            <FeatureItem 
              icon={<Clock className="w-6 h-6" />}
              title="Sprint Planning"
              description="Meet every deadline with our powerful timeline and calendar views."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
