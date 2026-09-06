import Link from "next/link";
import {
  Check,
  Crown,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    duration: "Forever",
    description: "Explore AuraGlance Education for free.",
    features: [
      "Basic syllabus access",
      "Limited quizzes",
      "Sample study materials",
      "Public leaderboard access",
    ],
    button: "Start Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Monthly",
    price: "₹31",
    duration: "30 Days",
    description: "Premium learning for just ₹1 per day.",
    features: [
      "Full syllabus access",
      "Unlimited quizzes",
      "Previous year papers",
      "Performance analytics",
      "Leaderboards",
      "Daily challenges",
    ],
    button: "Choose Monthly",
    href: "/register",
    popular: false,
  },
  {
    name: "Half-Yearly",
    price: "₹150",
    duration: "180 Days",
    description: "Save more with a 6-month learning plan.",
    features: [
      "Everything in Monthly",
      "6 months premium access",
      "Mock tests",
      "Advanced performance analytics",
      "Priority new features",
    ],
    button: "Choose Half-Yearly",
    href: "/register",
    popular: true,
  },
  {
    name: "Yearly",
    price: "₹300",
    duration: "365 Days",
    description: "The best value for serious learners.",
    features: [
      "Everything in Premium",
      "Full year access",
      "All mock tests",
      "Advanced analytics",
      "Priority access to new features",
    ],
    button: "Choose Yearly",
    href: "/register",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap size={22} />
            </div>

            <div>
              <div className="font-bold text-slate-900">
                AuraGlance
              </div>
              <div className="text-[10px] tracking-widest text-blue-600">
                EDUCATION
              </div>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-4 pb-12 pt-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} />
            Affordable Premium Learning
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Learn More. Pay Less.
          </h1>

          <p className="mt-5 text-lg text-slate-600">
            Quality education should be affordable for every student.
            Get premium learning access starting at just ₹1 per day.
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                plan.popular
                  ? "border-blue-600 bg-white ring-2 ring-blue-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                    <Crown size={14} />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <h2 className="text-xl font-bold text-slate-900">
                {plan.name}
              </h2>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-slate-900">
                  {plan.price}
                </span>

                <span className="ml-2 text-sm text-slate-500">
                  / {plan.duration}
                </span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-sm font-semibold text-slate-900">
                  What&apos;s included
                </p>

                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <Check
                        size={18}
                        className="mt-0.5 shrink-0 text-green-600"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.href}
                className={`mt-8 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {plan.button}
                <ArrowRight size={17} />
              </Link>
            </div>
          ))}

        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-slate-500">
          All premium plans give access to AuraGlance Education&apos;s premium
          learning features. You can upgrade your learning journey anytime.
        </p>
      </section>
    </main>
  );
}
