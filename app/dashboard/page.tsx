"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Crown,
  Flame,
  TrendingUp,
  ClipboardList,
  Plus,
  Target,
  Bell,
  User,
  LogOut,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Preparation = {
  id: string;
  name: string;
  category: string;
  slug: string;
};

export default function DashboardPage() {
  const [userName, setUserName] = useState("Student");
  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const name =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Student";

      setUserName(name);

      const { data, error } = await supabase
        .from("user_preparations")
        .select(`
          learning_paths (
            id,
            name,
            category,
            slug
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Preparation loading error:", error);
      } else if (data) {
        const selectedPreparations = data
          .map((item) => item.learning_paths)
          .filter(Boolean) as unknown as Preparation[];

        setPreparations(selectedPreparations);
      }

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={36} />
          <p className="mt-4 text-slate-600">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap size={22} />
            </div>

            <div>
              <div className="font-bold text-slate-900">
                AuraGlance
              </div>

              <div className="text-[10px] tracking-widest text-slate-500">
                EDUCATION
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">

            <button className="text-slate-500 hover:text-blue-600">
              <Bell size={20} />
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                Student
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User size={18} />
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600"
              title="Logout"
            >
              <LogOut size={19} />
            </button>

          </div>
        </div>
      </header>


      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* WELCOME */}
        <section>

          <p className="text-sm font-semibold tracking-wide text-blue-600">
            WELCOME TO AURAGLANCE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome back, {userName} 👋
          </h1>

          <p className="mt-2 text-slate-600">
            Your learning journey starts here.
          </p>

        </section>


        {/* STATS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<Flame size={22} />}
            title="Current Streak"
            value="0 Days"
            description="Start learning today"
          />

          <StatCard
            icon={<BookOpen size={22} />}
            title="Preparations"
            value={String(preparations.length)}
            description="Your selected learning goals"
          />

          <StatCard
            icon={<ClipboardList size={22} />}
            title="Quizzes Taken"
            value="0"
            description="Test your knowledge"
          />

          <StatCard
            icon={<TrendingUp size={22} />}
            title="Overall Progress"
            value="0%"
            description="Start learning to track progress"
          />

        </section>


        {/* MAIN GRID */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* MY PREPARATIONS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    My Preparations
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your selected learning goals.
                  </p>
                </div>

                <Link
                  href="/onboarding"
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Manage
                </Link>

              </div>


              {preparations.length === 0 ? (

                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                  <Target
                    size={36}
                    className="mx-auto text-blue-500"
                  />

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    Choose your first preparation
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                    You can prepare for NEET, JEE, UPSC, Government Exams,
                    School Education and many more.
                  </p>

                  <Link
                    href="/onboarding"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Explore Preparations
                    <Plus size={18} />
                  </Link>

                </div>

              ) : (

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  {preparations.map((preparation) => (

                    <Link
                      key={preparation.id}
                      href={`/learn/${preparation.slug}`}
                      className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <BookOpen size={21} />
                        </div>

                        <ArrowIcon />

                      </div>

                      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {preparation.category}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {preparation.name}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Start learning and track your progress.
                      </p>

                    </Link>

                  ))}

                </div>

              )}

            </div>


            {/* CONTINUE LEARNING */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <h2 className="text-xl font-bold text-slate-900">
                Continue Learning
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your recently accessed content will appear here.
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center">

                <BookOpen
                  size={32}
                  className="mx-auto text-slate-400"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Start a preparation to begin learning.
                </p>

              </div>

            </div>

          </div>


          {/* RIGHT */}
          <div className="space-y-6">

            <div className="rounded-2xl bg-blue-600 p-6 text-white">

              <div className="flex items-center gap-2">
                <Flame size={20} />

                <span className="font-semibold">
                  Daily Challenge
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Ready to challenge yourself?
              </h3>

              <p className="mt-2 text-sm text-blue-100">
                Complete daily quizzes and build your learning streak.
              </p>

              <button className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                Start Challenge
              </button>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex items-center gap-2">

                <Trophy size={21} className="text-yellow-500" />

                <h2 className="font-bold text-slate-900">
                  Leaderboard
                </h2>

              </div>

              <p className="mt-3 text-sm text-slate-500">
                Participate in quizzes and compete with students across India.
              </p>

            </div>


            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6">

              <div className="flex items-center gap-2">

                <Crown size={21} className="text-yellow-600" />

                <h2 className="font-bold text-slate-900">
                  AuraGlance Premium
                </h2>

              </div>

              <p className="mt-3 text-sm text-slate-600">
                Unlock mock tests, advanced analytics and premium features.
              </p>

              <Link
                href="/premium"
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                View Premium
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}


function ArrowIcon() {
  return (
    <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
      →
    </span>
  );
}


function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {title}
      </p>

      <h3 className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}
