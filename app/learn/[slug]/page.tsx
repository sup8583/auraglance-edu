"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  GraduationCap,
  ArrowLeft,
  BookOpen,
  FileText,
  ClipboardList,
  Trophy,
  Target,
  BarChart3,
  Clock,
  Loader2,
  ChevronRight,
  Lock,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type LearningPath = {
  id: string;
  name: string;
  slug: string;
  category: string;
};

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    loadLearningPath();
  }, [slug]);

  async function loadLearningPath() {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Find the learning path
      const { data: learningPath, error: pathError } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("slug", slug)
        .single();

      if (pathError || !learningPath) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // Verify student selected this preparation
      const { data: preparation } = await supabase
        .from("user_preparations")
        .select("id")
        .eq("user_id", user.id)
        .eq("learning_path_id", learningPath.id)
        .maybeSingle();

      if (!preparation) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setPath(learningPath);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setAccessDenied(true);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </main>
    );
  }

  if (accessDenied || !path) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <Lock className="mx-auto text-slate-400" size={40} />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Preparation not available
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Please select this preparation from your learning goals first.
          </p>

          <Link
            href="/onboarding"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Choose Preparations
          </Link>
        </div>
      </main>
    );
  }

  const learningSections = [
    {
      title: "Syllabus",
      description: `Explore the complete ${path.name} syllabus`,
      icon: <BookOpen size={24} />,
      href: `/learn/${path.slug}/syllabus`,
      available: true,
    },
    {
      title: "Study Materials",
      description: "Learn topics with structured study content",
      icon: <FileText size={24} />,
      href: `/learn/${path.slug}/study`,
      available: true,
    },
    {
      title: "Previous Year Papers",
      description: "Practice real questions from previous exams",
      icon: <ClipboardList size={24} />,
      href: `/learn/${path.slug}/papers`,
      available: true,
    },
    {
      title: "Practice Quizzes",
      description: "Test your knowledge chapter by chapter",
      icon: <Target size={24} />,
      href: `/learn/${path.slug}/quiz`,
      available: true,
    },
    {
      title: "Mock Tests",
      description: "Experience full exam-style mock tests",
      icon: <Clock size={24} />,
      href: `/learn/${path.slug}/mock-tests`,
      available: true,
    },
    {
      title: "Leaderboard",
      description: "Compete with students across India",
      icon: <Trophy size={24} />,
      href: `/learn/${path.slug}/leaderboard`,
      available: true,
    },
    {
      title: "Performance",
      description: "Track your learning progress and strengths",
      icon: <BarChart3 size={24} />,
      href: `/learn/${path.slug}/performance`,
      available: true,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Dashboard
          </Link>

          <div className="h-6 w-px bg-slate-200" />

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap size={20} />
            </div>

            <div className="font-bold text-slate-900">
              AuraGlance Education
            </div>
          </Link>

        </div>
      </header>


      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* HERO */}

        <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white sm:p-12">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
            {path.category}
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            {path.name}
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Your complete preparation workspace. Learn concepts, practice
            questions, take mock tests and track your performance.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            <div className="rounded-xl bg-white/15 px-4 py-2 text-sm">
              📚 Structured Learning
            </div>

            <div className="rounded-xl bg-white/15 px-4 py-2 text-sm">
              📝 Practice Questions
            </div>

            <div className="rounded-xl bg-white/15 px-4 py-2 text-sm">
              🏆 Compete & Improve
            </div>

          </div>

        </section>


        {/* START LEARNING */}

        <section className="mt-10">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Start Learning
            </h2>

            <p className="mt-1 text-slate-600">
              Choose how you want to begin your preparation.
            </p>
          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {learningSections.map((section) => (

              <Link
                key={section.title}
                href={section.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {section.icon}
                  </div>

                  <ChevronRight
                    size={20}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />

                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {section.description}
                </p>

              </Link>

            ))}

          </div>

        </section>


        {/* QUICK START */}

        <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Not sure where to start?
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Start with the syllabus and build your preparation step by step.
              </p>

            </div>

            <Link
              href={`/learn/${path.slug}/syllabus`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              View Syllabus
              <ChevronRight size={18} />
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}
