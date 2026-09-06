import Navbar from "@/src/components/layout/Navbar";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  FileText,
  Trophy,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function NeetPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Medical Entrance Preparation
            </div>

            <h1 className="mt-6 text-4xl font-bold sm:text-6xl">
              NEET Preparation
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Everything you need to prepare smarter for NEET. Study, practice,
              take quizzes, analyze your performance and compete with students.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Start Preparing Free
            </Link>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Master Every Subject
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Your NEET Learning Journey
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <SubjectCard
              title="Physics"
              description="Master concepts, formulas and problem-solving techniques."
              topics="Mechanics • Thermodynamics • Optics"
            />

            <SubjectCard
              title="Chemistry"
              description="Learn Physical, Organic and Inorganic Chemistry."
              topics="Organic • Inorganic • Physical"
            />

            <SubjectCard
              title="Biology"
              description="Complete preparation for Botany and Zoology."
              topics="Botany • Zoology • Human Biology"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Everything for NEET Preparation
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<BookOpen size={24} />}
              title="Complete Syllabus"
              text="Organized NEET syllabus with subject-wise topics."
            />

            <Feature
              icon={<Brain size={24} />}
              title="Practice Quizzes"
              text="Chapter-wise questions to test your knowledge."
            />

            <Feature
              icon={<FileText size={24} />}
              title="Previous Papers"
              text="Access previous year NEET question papers."
            />

            <Feature
              icon={<Trophy size={24} />}
              title="Leaderboard"
              text="Compete and track your ranking among students."
            />
          </div>
        </div>
      </section>

      {/* PREPARATION STATS */}
      <section className="py-20">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 text-center sm:grid-cols-3">
          <div>
            <Clock className="mx-auto text-blue-600" size={32} />
            <h3 className="mt-4 text-xl font-bold">Daily Practice</h3>
            <p className="mt-2 text-sm text-slate-600">
              Build consistency with daily quizzes.
            </p>
          </div>

          <div>
            <CheckCircle2 className="mx-auto text-green-600" size={32} />
            <h3 className="mt-4 text-xl font-bold">Track Progress</h3>
            <p className="mt-2 text-sm text-slate-600">
              Understand your strengths and weaknesses.
            </p>
          </div>

          <div>
            <Trophy className="mx-auto text-yellow-500" size={32} />
            <h3 className="mt-4 text-xl font-bold">Compete</h3>
            <p className="mt-2 text-sm text-slate-600">
              See where you rank among other students.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function SubjectCard({
  title,
  description,
  topics,
}: {
  title: string;
  description: string;
  topics: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        <BookOpen size={24} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <p className="mt-4 text-xs font-medium text-blue-600">{topics}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="text-blue-600">{icon}</div>

      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}