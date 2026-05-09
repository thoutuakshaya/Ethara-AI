"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Manage your team&apos;s tasks with ease
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            TaskFlow is the ultimate team task manager. Create projects, assign tasks, track progress, and ensure your team stays on top of every deadline with role-based access control.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 flex items-center">
              Log in <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Work faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your projects
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600">
                  <CheckCircle className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">Task Tracking</dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Create, assign, and track tasks. Keep your team aligned and deliver projects on time.</p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600">
                  <Users className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">Team Collaboration</dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Work together seamlessly. Assign tasks to specific team members and monitor individual workloads.</p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600">
                  <Shield className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">Role-Based Access</dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Secure your projects. Distinguish between Admins who manage projects and Members who execute tasks.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
