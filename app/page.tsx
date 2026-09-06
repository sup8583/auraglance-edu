import Navbar from "@/src/components/layout/Navbar";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Trophy,
  Users,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <Brain size={16} />
              Learn smarter. Perform better.
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Prepare. Practice.
              <span className="block text-blue-600">Perform Better.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Your complete learning platform for competitive exams. Access
              syllabus, previous papers, quizzes, mock tests and compete with
              students across India.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Start Learning Free
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#exams"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Exams
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <div className="text-2xl font-bold text-slate-900">NEET</div>
                <div className="text-sm text-slate-500">Preparation</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-slate-900">JEE</div>
                <div className="text-sm text-slate-500">Coming Soon</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-slate-900">Daily</div>
                <div className="text-sm text-slate-500">Quizzes</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-slate-900">24/7</div>
                <div className="text-sm text-slate-500">Learning</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMS SECTION */}
      <section id="exams" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Choose Your Goal
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Prepare for the exams that matter
            </h2>

            <p className="mt-4 text-slate-600">
              Structured learning paths designed around your exam goals.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* NEET */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <BookOpen size={28} />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                NEET
              </h3>

              <p className="mt-3 text-slate-600">
                Complete preparation for medical entrance exams with structured
                syllabus, practice questions and mock tests.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Complete syllabus
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Chapter-wise quizzes
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Previous year papers
                </div>
              </div>

              <Link
                href="/neet"
                className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                Explore NEET
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* JEE */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <div className="absolute right-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Coming Soon
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Brain size={28} />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                JEE
              </h3>

              <p className="mt-3 text-slate-600">
                Prepare for JEE Main and Advanced with concept-based learning,
                practice and competitive performance tracking.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Physics, Chemistry & Mathematics
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Competitive quizzes
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Performance analytics
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Everything You Need
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Learn, practice and compete
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<BookOpen size={26} />}
              title="Smart Learning"
              description="Access syllabus, study materials and previous year question papers in one place."
            />

            <FeatureCard
              icon={<Brain size={26} />}
              title="Practice Quizzes"
              description="Test your knowledge with chapter-wise quizzes and improve your weak areas."
            />

            <FeatureCard
              icon={<Trophy size={26} />}
              title="Leaderboard"
              description="Compete with students across India and track your ranking."
            />

            <FeatureCard
              icon={<PlayCircle size={26} />}
              title="Mock Tests"
              description="Experience exam-style tests with timers, scoring and detailed results."
            />

            <FeatureCard
              icon={<Users size={26} />}
              title="Daily Challenges"
              description="Stay consistent with daily quizzes, streaks and learning challenges."
            />

            <FeatureCard
              icon={<Trophy size={26} />}
              title="Performance Analytics"
              description="Understand your strengths and weaknesses with detailed performance insights."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start your preparation journey today
          </h2>

          <p className="mt-4 text-lg text-blue-100">
            Learn smarter, practice consistently and track your progress.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg transition hover:bg-blue-50"
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-10 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">

            <div>
              <div className="font-semibold text-white text-lg">
                AuraGlance Education
              </div>

              <div className="mt-1 text-sm">
                © 2026 AuraGlance Innovations (OPC) Private Limited
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-blue-400">
                Founder & CEO
              </div>

              <div className="mt-1 font-semibold text-white">
                Sudharsanam Ponnuswamy Venugopal
              </div>
            </div>

            <div className="text-sm">
              Learn. Practice. Perform.
            </div>

          </div>

        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}