"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.session || !data.user) {
        setMessage("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      setMessage("Login successful. Opening dashboard...");

      window.setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);

    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

          <div className="hidden bg-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600">
                <GraduationCap size={28} />
              </div>

              <div>
                <div className="text-xl font-bold">AuraGlance</div>
                <div className="text-xs tracking-widest text-blue-200">
                  EDUCATION
                </div>
              </div>
            </Link>

            <div>
              <h1 className="text-4xl font-bold leading-tight">
                Learn smarter.
                <br />
                Perform better.
              </h1>

              <p className="mt-5 max-w-sm text-blue-100">
                Your complete learning platform for education,
                competitive exams and government examinations.
              </p>
            </div>

            <p className="text-sm text-blue-200">
              © 2026 AuraGlance Education
            </p>

          </div>

          <div className="bg-white p-8 sm:p-12">

            <Link
              href="/"
              className="mb-6 inline-flex text-sm font-medium text-slate-600 hover:text-blue-600 lg:hidden"
            >
              ← Back to home
            </Link>

            <h1 className="text-4xl font-bold text-slate-900">
              Welcome back
            </h1>

            <p className="mt-3 text-lg text-slate-600">
              Sign in to continue your learning journey.
            </p>

            <form onSubmit={handleLogin} className="mt-10 space-y-6">

              <div>
                <label className="mb-2 block text-base font-medium text-slate-800">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={21}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border-2 border-slate-300 bg-white py-4 pl-14 pr-4 text-base text-black placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-base font-medium text-slate-800">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={21}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border-2 border-slate-300 bg-white py-4 pl-14 pr-4 text-base text-black placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    message.includes("successful")
                      ? "border border-green-300 bg-green-50 text-green-700"
                      : "border border-red-300 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={21} />}
              </button>

            </form>

            <p className="mt-8 text-center text-base text-slate-600">
              Don't have an account?{" "}

              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create free account
              </Link>
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}
