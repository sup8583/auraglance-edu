"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Loader2,
  Circle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type LearningPath = {
  id: string;
  name: string;
  slug: string;
  category: string;
};

type Subject = {
  id: string;
  name: string;
  slug: string;
};

type Chapter = {
  id: string;
  name: string;
  slug: string | null;
  chapter_order: number;
  description: string | null;
};

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;
  const subjectSlug = params.subject as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjectData();
  }, [slug, subjectSlug]);

  async function loadSubjectData() {
    try {
      setLoading(true);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Get learning path
      const { data: pathData, error: pathError } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("slug", slug)
        .single();

      if (pathError || !pathData) {
        console.error("Learning path error:", pathError);
        router.push("/dashboard");
        return;
      }

      setPath(pathData);

      // Get subject
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("id, name, slug")
        .eq("learning_path_id", pathData.id)
        .eq("slug", subjectSlug)
        .single();

      if (subjectError || !subjectData) {
        console.error("Subject error:", subjectError);
        router.push(`/learn/${slug}/syllabus`);
        return;
      }

      setSubject(subjectData);

      // Get chapters in correct database order
      const { data: chapterData, error: chapterError } = await supabase
        .from("chapters")
        .select("id, name, slug, chapter_order, description")
        .eq("subject_id", subjectData.id)
        .order("chapter_order", { ascending: true });

      if (chapterError) {
        console.error("Chapter error:", chapterError);
        setChapters([]);
        return;
      }

      setChapters(chapterData || []);

    } catch (error) {
      console.error("Unexpected error:", error);
      router.push("/dashboard");
    } finally {
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

  if (!path || !subject) return null;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

          <Link
            href={`/learn/${slug}/syllabus`}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={19} />
            Back to Syllabus
          </Link>

        </div>
      </header>


      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* TITLE */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            {path.name}
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            {subject.name}
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Complete all chapters and track your learning progress.
          </p>

        </div>


        {/* PROGRESS */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="font-semibold text-slate-900">
                Subject Progress
              </p>

              <p className="mt-1 text-sm text-slate-500">
                0 of {chapters.length} chapters completed
              </p>
            </div>

            <div className="text-2xl font-bold text-blue-600">
              0%
            </div>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-0 bg-blue-600" />
          </div>

        </div>


        {/* CHAPTERS */}

        <section className="mt-10">

          <h2 className="text-2xl font-bold text-slate-900">
            Chapters
          </h2>

          <p className="mt-2 text-slate-600">
            Select a chapter to start learning.
          </p>


          <div className="mt-6 space-y-3">

            {chapters.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                <BookOpen
                  size={36}
                  className="mx-auto text-slate-400"
                />

                <h3 className="mt-4 font-bold text-slate-900">
                  Chapters coming soon
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  We are preparing structured content for this subject.
                </p>

              </div>

            ) : (

              chapters.map((chapter) => (

                <Link
                  key={chapter.id}
                  href={`/learn/${slug}/syllabus/${subjectSlug}/${chapter.chapter_order}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                      {chapter.chapter_order}
                    </div>

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {chapter.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {chapter.description || "Start learning this chapter"}
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <Circle
                      size={20}
                      className="text-slate-300"
                    />

                    <ChevronRight
                      size={20}
                      className="text-slate-400 group-hover:text-blue-600"
                    />

                  </div>

                </Link>

              ))

            )}

          </div>

        </section>

      </div>

    </main>
  );
}
