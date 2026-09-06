"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  FileText,
  HelpCircle,
  Loader2,
  Clock,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type LearningPath = {
  id: string;
  name: string;
  slug: string;
  category: string;
};


export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;
  const subject = params.subject as string;
  const chapterParam = params.chapter as string;

  const chapterNumber = Number(chapterParam);

  const [path, setPath] = useState<LearningPath | null>(null);
  const [chapterName, setChapterName] = useState("");
  const [chapters, setChapters] = useState<
    { id: string; name: string; slug: string; chapter_order: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadChapter();
  }, [slug, subject, chapterNumber]);

  async function loadChapter() {
    try {
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
        router.push("/dashboard");
        return;
      }

      setPath(pathData);

      // Get subject
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("id, name, slug")
        .eq("learning_path_id", pathData.id)
        .eq("slug", subject)
        .single();

      if (subjectError || !subjectData) {
        router.push(`/learn/${slug}/syllabus`);
        return;
      }

      // Get all real chapters
      const { data: chapterData, error: chapterError } = await supabase
        .from("chapters")
        .select("id, name, slug, chapter_order")
        .eq("subject_id", subjectData.id)
        .eq("is_active", true)
        .order("chapter_order", { ascending: true });

      if (chapterError || !chapterData || chapterData.length === 0) {
        router.push(`/learn/${slug}/syllabus/${subject}`);
        return;
      }

      setChapters(chapterData);

      const currentChapter = chapterData.find(
        (item) => item.chapter_order === chapterNumber
      );

      if (!currentChapter) {
        router.push(`/learn/${slug}/syllabus/${subject}`);
        return;
      }

      setChapterName(currentChapter.name);

    } catch (error) {
      console.error("Error loading chapter:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  function markComplete() {
    setCompleted(true);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </main>
    );
  }

  if (!path || !chapterName) return null;

  const currentIndex = chapters.findIndex(
    (item) => item.chapter_order === chapterNumber
  );

  const previousChapter =
    currentIndex > 0
      ? chapters[currentIndex - 1].chapter_order
      : null;

  const nextChapter =
    currentIndex >= 0 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1].chapter_order
      : null;

  const subjectName =
    subject.charAt(0).toUpperCase() + subject.slice(1);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link
            href={`/learn/${slug}/syllabus/${subject}`}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={19} />
            Back to {subjectName}
          </Link>

          <div className="hidden text-sm text-slate-500 sm:block">
            {path.name} • {subjectName}
          </div>

        </div>
      </header>


      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* BREADCRUMB */}

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">

          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>

          <ChevronRight size={15} />

          <Link href={`/learn/${slug}`} className="hover:text-blue-600">
            {path.name}
          </Link>

          <ChevronRight size={15} />

          <Link
            href={`/learn/${slug}/syllabus/${subject}`}
            className="hover:text-blue-600"
          >
            {subjectName}
          </Link>

          <ChevronRight size={15} />

          <span className="text-slate-900">
            Chapter {chapterNumber}
          </span>

        </div>


        {/* CHAPTER HEADER */}

        <section className="mt-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Chapter {chapterNumber} of {chapters.length}
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            {chapterName}
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Learn the core concepts, understand important topics and test your knowledge.
          </p>

        </section>


        {/* CHAPTER PROGRESS */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              {completed ? (
                <CheckCircle2 className="text-green-600" size={28} />
              ) : (
                <Circle className="text-slate-300" size={28} />
              )}

              <div>
                <p className="font-semibold text-slate-900">
                  Chapter Progress
                </p>

                <p className="text-sm text-slate-500">
                  {completed ? "Completed" : "Not completed yet"}
                </p>
              </div>

            </div>

            <div className="text-lg font-bold text-blue-600">
              {completed ? "100%" : "0%"}
            </div>

          </div>

        </section>


        {/* LEARNING MODULES */}

        <section className="mt-10">

          <h2 className="text-2xl font-bold text-slate-900">
            Learning Modules
          </h2>

          <p className="mt-2 text-slate-600">
            Follow these steps to complete the chapter.
          </p>


          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Link
              href={`/learn/${slug}/syllabus/${subject}/${chapterNumber}/concepts`}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen size={24} />
                </div>

                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Learn Concepts
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Study the important concepts and explanations for this chapter.
              </p>

            </Link>


            <Link
              href={`/learn/${slug}/syllabus/${subject}/${chapterNumber}/videos`}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <PlayCircle size={24} />
                </div>

                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Video Learning
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Watch recommended educational video lessons.
              </p>

            </Link>


            <Link
              href={`/learn/${slug}/syllabus/${subject}/${chapterNumber}/notes`}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={24} />
                </div>

                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Study Notes
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Read concise notes and important formulas.
              </p>

            </Link>


            <Link
              href={`/learn/${slug}/syllabus/${subject}/${chapterNumber}/quiz`}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <HelpCircle size={24} />
                </div>

                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-blue-600"
                />

              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Practice Quiz
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Test your understanding with chapter-wise questions.
              </p>

            </Link>

          </div>

        </section>


        {/* COMPLETE */}

        <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Finished this chapter?
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Mark it as complete and continue to the next chapter.
              </p>
            </div>

            <button
              onClick={markComplete}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white ${
                completed
                  ? "bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {completed ? (
                <>
                  <CheckCircle2 size={18} />
                  Completed
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Mark Complete
                </>
              )}
            </button>

          </div>

        </section>


        {/* CHAPTER NAVIGATION */}

        <section className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200 pt-8">

          {previousChapter ? (
            <Link
              href={`/learn/${slug}/syllabus/${subject}/${previousChapter}`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-300"
            >
              <ChevronLeft size={18} />
              Previous
            </Link>
          ) : (
            <div />
          )}


          {nextChapter ? (
            <Link
              href={`/learn/${slug}/syllabus/${subject}/${nextChapter}`}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Next Chapter
              <ChevronRight size={18} />
            </Link>
          ) : (
            <Link
              href={`/learn/${slug}/syllabus/${subject}`}
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Subject Complete
            </Link>
          )}

        </section>

      </div>

    </main>
  );
}
