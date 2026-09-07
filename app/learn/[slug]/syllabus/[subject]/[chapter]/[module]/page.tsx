"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  HelpCircle,
  Loader2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { saveQuizAttempt } from "@/lib/services/student-progress";

type LearningPath = {
  id: string;
  name: string;
  slug: string;
};

type ContentData = {
  id: string;
  title: string;
  content: any;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  question_order: number;
};

export default function LearningModulePage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;
  const subject = params.subject as string;
  const chapter = Number(params.chapter);
  const module = params.module as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [content, setContent] = useState<ContentData | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    loadContent();
  }, [slug, subject, chapter, module]);

  async function loadContent() {
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

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

      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("id")
        .eq("learning_path_id", pathData.id)
        .eq("slug", subject)
        .single();

      if (!subjectError && subjectData) {
        setSubjectId(subjectData.id);

        const { data: chapterData, error: chapterError } = await supabase
          .from("chapters")
          .select("id")
          .eq("subject_id", subjectData.id)
          .eq("chapter_order", chapter)
          .single();

        if (!chapterError && chapterData) {
          setChapterId(chapterData.id);
        }
      }

      if (module === "quiz") {
        const { data: quizData, error: quizError } = await supabase
          .from("chapter_quizzes")
          .select("*")
          .eq("learning_path_id", pathData.id)
          .eq("subject_slug", subject)
          .eq("chapter_number", chapter)
          .eq("is_published", true);

        if (!quizError && quizData) {
          setQuestions(quizData);
        }
      } else {
        const contentType =
          module === "concepts"
            ? "concept"
            : module === "notes"
            ? "notes"
            : module;

        const { data: contentData, error: contentError } = await supabase
          .from("chapter_content")
          .select("*")
          .eq("learning_path_id", pathData.id)
          .eq("subject_slug", subject)
          .eq("chapter_number", chapter)
          .eq("content_type", contentType)
          .eq("is_published", true)
          .single();

        if (!contentError && contentData) {
          setContent(contentData);
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(option: string) {
    if (showAnswer) return;

    setSelectedAnswer(option);
  }

  function submitAnswer() {
    if (!selectedAnswer) return;

    setShowAnswer(true);

    if (
      questions[currentQuestion] &&
      selectedAnswer === questions[currentQuestion].correct_answer
    ) {
      setScore((previous) => previous + 1);
    }
  }

  async function nextQuestion() {
    if (currentQuestion + 1 >= questions.length) {
      setQuizFinished(true);

      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (
          user &&
          path &&
          subjectId &&
          chapterId
        ) {
          const answers = questions.map(
            (question, index) => ({
              question_id: question.id,
              selected_answer:
                index === currentQuestion
                  ? selectedAnswer
                  : null,
              correct_answer: question.correct_answer,
            })
          );

          await saveQuizAttempt({
            userId: user.id,
            learningPathId: path.id,
            subjectId,
            chapterId,
            totalQuestions: questions.length,
            correctAnswers: score,
            answers,
          });
        }
      } catch (error) {
        console.error(
          "Error saving quiz progress:",
          error
        );
      }

      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer("");
    setShowAnswer(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 size={36} className="animate-spin text-blue-600" />
      </main>
    );
  }

  const moduleTitle =
    module === "concepts"
      ? "Learn Concepts"
      : module === "notes"
      ? "Study Notes"
      : module === "quiz"
      ? "Practice Quiz"
      : "Learning";

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6 lg:px-8">

          <Link
            href={`/learn/${slug}/syllabus/${subject}/${chapter}`}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Chapter
          </Link>

        </div>
      </header>


      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        {/* TITLE */}

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            {path?.name} • {subject} • Chapter {chapter}
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            {moduleTitle}
          </h1>

        </div>


        {/* ================= CONCEPTS ================= */}

        {module === "concepts" && content && (

          <div className="space-y-8">

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

              <h2 className="text-xl font-bold text-slate-900">
                Introduction
              </h2>

              <p className="mt-3 leading-7 text-slate-700">
                {content.content.introduction}
              </p>

            </div>


            {content.content.topics?.map(
              (topic: any, index: number) => (

                <section
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <BookOpen size={20} />
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {topic.title}
                    </h2>

                  </div>


                  {topic.content && (

                    <p className="mt-5 leading-7 text-slate-700">
                      {topic.content}
                    </p>

                  )}


                  {/* KEY POINTS */}

                  {topic.key_points && (

                    <div className="mt-5">

                      <h3 className="font-semibold text-slate-900">
                        Key Points
                      </h3>

                      <ul className="mt-3 space-y-2">

                        {topic.key_points.map(
                          (point: string, i: number) => (

                            <li
                              key={i}
                              className="flex gap-3 text-slate-700"
                            >

                              <CheckCircle2
                                size={18}
                                className="mt-1 shrink-0 text-green-600"
                              />

                              {point}

                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}


                  {/* RULES */}

                  {topic.rules && (

                    <div className="mt-5">

                      <h3 className="font-semibold text-slate-900">
                        Rules
                      </h3>

                      <ul className="mt-3 space-y-2">

                        {topic.rules.map(
                          (rule: string, i: number) => (

                            <li
                              key={i}
                              className="flex gap-3 text-slate-700"
                            >

                              <CheckCircle2
                                size={18}
                                className="mt-1 shrink-0 text-blue-600"
                              />

                              {rule}

                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}


                  {/* EXAMPLES */}

                  {topic.examples && (

                    <div className="mt-5 rounded-xl bg-slate-50 p-5">

                      <h3 className="font-semibold text-slate-900">
                        Examples
                      </h3>

                      <ul className="mt-3 space-y-2">

                        {topic.examples.map(
                          (example: string, i: number) => (

                            <li key={i} className="text-slate-700">
                              • {example}
                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}


                  {/* APPLICATIONS */}

                  {topic.applications && (

                    <div className="mt-5">

                      <h3 className="font-semibold text-slate-900">
                        Applications
                      </h3>

                      <ul className="mt-3 space-y-2">

                        {topic.applications.map(
                          (item: string, i: number) => (

                            <li
                              key={i}
                              className="flex gap-3 text-slate-700"
                            >

                              <ChevronRight
                                size={18}
                                className="mt-1 shrink-0 text-blue-600"
                              />

                              {item}

                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}


                  {/* TABLE */}

                  {topic.table && (

                    <div className="mt-6 overflow-x-auto">

                      <table className="w-full border-collapse text-slate-800">

                        <thead>

                          <tr className="bg-blue-50 text-left text-slate-900">

                            <th className="border border-slate-200 p-3">
                              Quantity
                            </th>

                            <th className="border border-slate-200 p-3">
                              SI Unit
                            </th>

                            <th className="border border-slate-200 p-3">
                              Symbol
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {topic.table.map(
                            (row: any, i: number) => (

                              <tr key={i}>

                                <td className="border border-slate-300 p-3 text-slate-800">
                                  {row.quantity}
                                </td>

                                <td className="border border-slate-300 p-3 text-slate-800">
                                  {row.unit}
                                </td>

                                <td className="border border-slate-300 p-3 text-slate-800">
                                  {row.symbol}
                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </section>

              )
            )}


            {/* SUMMARY */}

            {content.content.summary && (

              <section className="rounded-2xl bg-slate-900 p-7 text-white">

                <h2 className="text-xl font-bold">
                  Chapter Summary
                </h2>

                <ul className="mt-5 space-y-3">

                  {content.content.summary.map(
                    (item: string, i: number) => (

                      <li
                        key={i}
                        className="flex gap-3 text-slate-200"
                      >

                        <CheckCircle2
                          size={18}
                          className="mt-1 shrink-0 text-green-400"
                        />

                        {item}

                      </li>

                    )
                  )}

                </ul>

              </section>

            )}


            {/* NEET FOCUS */}

            {content.content.neet_focus && (

              <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-7">

                <h2 className="text-xl font-bold text-slate-900">
                  NEET Exam Focus
                </h2>

                <ul className="mt-5 space-y-3">

                  {content.content.neet_focus.map(
                    (item: string, i: number) => (

                      <li
                        key={i}
                        className="text-slate-700"
                      >
                        • {item}
                      </li>

                    )
                  )}

                </ul>

              </section>

            )}

          </div>

        )}


        {/* ================= NOTES ================= */}

        {module === "notes" && content && (

          <div className="space-y-6">

            {content.content.quick_revision?.map(
              (section: any, index: number) => (

                <section
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >

                  <div className="flex items-center gap-3">

                    <FileText className="text-blue-600" size={22} />

                    <h2 className="text-xl font-bold text-slate-900">
                      {section.heading}
                    </h2>

                  </div>


                  <ul className="mt-5 space-y-3">

                    {section.points.map(
                      (point: string, i: number) => (

                        <li
                          key={i}
                          className="flex gap-3 text-slate-700"
                        >

                          <CheckCircle2
                            size={18}
                            className="mt-1 shrink-0 text-green-600"
                          />

                          {point}

                        </li>

                      )
                    )}

                  </ul>

                </section>

              )
            )}


            {content.content.one_minute_revision && (

              <section className="rounded-2xl bg-blue-600 p-7 text-white">

                <h2 className="text-xl font-bold">
                  1 Minute Revision
                </h2>

                <ul className="mt-5 space-y-3 text-blue-50">

                  {content.content.one_minute_revision.map(
                    (item: string, i: number) => (

                      <li key={i}>
                        {i + 1}. {item}
                      </li>

                    )
                  )}

                </ul>

              </section>

            )}

          </div>

        )}


        {/* ================= QUIZ ================= */}

        {module === "quiz" && (

          <div>

            {questions.length === 0 && (

              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

                <HelpCircle
                  size={42}
                  className="mx-auto text-slate-400"
                />

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Quiz Coming Soon
                </h2>

                <p className="mt-2 text-slate-600">
                  Questions for this chapter are being prepared.
                </p>

              </div>

            )}


            {questions.length > 0 && !quizFinished && (

              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-blue-600">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>

                  <span className="text-sm text-slate-500">
                    Score: {score}
                  </span>

                </div>


                <div className="mt-8">

                  <h2 className="text-xl font-bold leading-8 text-slate-900">

                    {questions[currentQuestion]?.question}

                  </h2>


                  <div className="mt-7 space-y-3">

                    {(questions[currentQuestion]?.options || []).map(
                      (optionText, index) => {
                        const optionKey = String.fromCharCode(65 + index);

                        const isSelected =
                          selectedAnswer === optionText;

                        const isCorrect =
                          showAnswer &&
                          optionText ===
                            questions[currentQuestion]?.correct_answer;

                        const isWrong =
                          showAnswer &&
                          isSelected &&
                          !isCorrect;

                        return (

                          <button
                            key={optionKey}
                            onClick={() =>
                              selectAnswer(optionText)
                            }
                            className={`w-full rounded-xl border p-4 text-left transition

                            ${
                              isCorrect
                                ? "border-green-500 bg-green-50"
                                : isWrong
                                ? "border-red-500 bg-red-50"
                                : isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-blue-300"
                            }`}

                          >

                            <span className="font-semibold">
                              {optionKey}.
                            </span>

                            <span className="ml-3">
                              {optionText}
                            </span>

                          </button>

                        );

                      }
                    )}

                  </div>


                  {!showAnswer ? (

                    <button
                      onClick={submitAnswer}
                      disabled={!selectedAnswer}
                      className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Check Answer
                    </button>

                  ) : (

                    <div className="mt-7">

                      <div className="rounded-xl bg-slate-50 p-5">

                        <h3 className="font-bold text-slate-900">
                          Explanation
                        </h3>

                        <p className="mt-2 leading-7 text-slate-700">

                          {questions[currentQuestion]?.explanation}

                        </p>

                      </div>


                      <button
                        onClick={nextQuestion}
                        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        {currentQuestion + 1 === questions.length
                          ? "Finish Quiz"
                          : "Next Question"}
                      </button>

                    </div>

                  )}

                </div>

              </div>

            )}


            {quizFinished && (

              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

                <CheckCircle2
                  size={50}
                  className="mx-auto text-green-600"
                />

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Quiz Completed!
                </h2>

                <p className="mt-3 text-lg text-slate-600">

                  You scored {score} out of {questions.length}

                </p>


                <Link
                  href={`/learn/${slug}/syllabus/${subject}/${chapter}`}
                  className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Back to Chapter
                </Link>

              </div>

            )}

          </div>

        )}


        {/* CONTENT NOT FOUND */}

        {module !== "quiz" && !content && (

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

            <BookOpen
              size={42}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Content is being prepared
            </h2>

            <p className="mt-2 text-slate-600">
              This chapter content will be available soon.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}
