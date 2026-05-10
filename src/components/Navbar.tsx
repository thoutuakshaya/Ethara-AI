"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Layers, LayoutDashboard, Briefcase, LogOut, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group transition-all duration-300">
              <div className="bg-[#0F172A] p-2 rounded-lg shadow-sm group-hover:scale-105 transition-all">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8L8 12L16 16L24 12L16 8Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 16L16 20L24 16" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 20L16 24L24 20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </span>
            </Link>
            
            {session && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  href="/dashboard"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white inline-flex items-center px-1 pt-1 text-sm font-semibold transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white inline-flex items-center px-1 pt-1 text-sm font-semibold transition-colors"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Projects
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-5">
            {session ? (
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {session.user?.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-black text-indigo-600">
                    {session.user?.role}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-slate-200 dark:border-slate-800"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="hidden sm:flex items-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white px-4 py-2 text-sm font-bold transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
