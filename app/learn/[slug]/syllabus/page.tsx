"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Atom,
  FlaskConical,
  Dna,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type LearningPath = {
  id: string;
  name: string;
  slug: string;
  category: string;
};

type Subject = {
  name: string;
  description: string;
  chapters: number;
  icon: "physics" | "chemistry" | "biology" | "default";
};

export default function SyllabusPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPath();
  }, [slug]);

  async function loadPath() {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        router.push("/dashboard");
        return;
      }

      setPath(data);
    } catch (error) {
      console.error(error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  function getSubjects(): Subject[] {
    if (slug === "neet") {
      return [
        {
          name: "Physics",
          description: "Mechanics, Electrodynamics, Modern Physics and more",
          chapters: 29,
          icon: "physics",
        },
        {
          name: "Chemistry",
          description: "Physical, Organic and Inorganic Chemistry",
          chapters: 30,
          icon: "chemistry",
        },
        {
          name: "Biology",
          description: "Botany and Zoology complete syllabus",
          chapters: 38,
          icon: "biology",
        },
      ];
    }

    if (slug.includes("jee")) {
      return [
        {
          name: "Physics",
          description: "Complete Physics syllabus",
          chapters: 29,
          icon: "physics",
        },
        {
          name: "Chemistry",
          description: "Physical, Organic and Inorganic Chemistry",
          chapters: 30,
          icon: "chemistry",
        },
        {
          name: "Mathematics",
          description: "Complete Mathematics syllabus",
          chapters: 25,
          icon: "default",
        },
      ];
    }

    return [
      {
        name: "Complete Syllabus",
        description: `Explore the complete ${path?.name || ""} syllabus`,
        chapters: 0,
        icon: "default",
      },
    ];
  }

  function SubjectIcon({ icon }: { icon: Subject["icon"] }) {
    if (icon === "physics") return <Atom size={28} />;
    if (icon === "chemistry") return <FlaskConical size={28} />;
    if (icon === "biology") return <Dna size={28} />;

    return <BookOpen size={28} />;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </main>
    );
  }

  if (!path) return null;

  const subjects = getSubjects();

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

          <Link
            href={`/learn/${slug}`}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={19} />
            Back to {path.name}
          </Link>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* TITLE */}

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            {path.name}
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Complete Syllabus
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Explore your syllabus subject by subject and track your learning
            progress.
          </p>

        </div>


        {/* PROGRESS */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="font-semibold text-slate-900">
                Your Syllabus Progress
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Start learning to track your progress.
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                0%
              </p>
            </div>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-0 rounded-full bg-blue-600" />
          </div>

        </div>


        {/* SUBJECTS */}

        <section className="mt-10">

          <h2 className="text-2xl font-bold text-slate-900">
            Subjects
          </h2>

          <p className="mt-2 text-slate-600">
            Select a subject to explore its chapters.
          </p>


          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {subjects.map((subject) => (

              <Link
                key={subject.name}
                href={`/learn/${slug}/syllabus/${subject.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <SubjectIcon icon={subject.icon} />
                  </div>

                  <ChevronRight
                    size={21}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />

                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {subject.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {subject.description}
                </p>

                {subject.chapters > 0 && (
                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">

                    <CheckCircle2 size={16} className="text-blue-600" />

                    {subject.chapters} Chapters

                  </div>
                )}

              </Link>

            ))}

          </div>

        </section>


        {/* INFO */}

        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <h3 className="font-bold text-slate-900">
            Learn at your own pace
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Complete chapters one by one, practice questions and track your
            progress throughout your preparation journey.
          </p>

        </div>

      </div>

    </main>
  );
}
