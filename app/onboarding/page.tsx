"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  Check,
  ArrowRight,
  Loader2,
  BookOpen,
  Trophy,
  Landmark,
  Briefcase,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type LearningPath = {
  id: string;
  name: string;
  slug: string;
  category: string;
};

export default function OnboardingPage() {
  const router = useRouter();

  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPaths();
  }, []);

  async function loadPaths() {
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
        .select("id, name, slug, category")
        .order("category")
        .order("name");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const { data: existing } = await supabase
        .from("user_preparations")
        .select("learning_path_id")
        .eq("user_id", user.id);

      if (existing) {
        setSelected(existing.map((item) => item.learning_path_id));
      }

      setPaths(data || []);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setError("Unable to load learning paths.");
      setLoading(false);
    }
  }

  function toggleSelection(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  async function savePreparations() {
    if (selected.length === 0) {
      setError("Please select at least one preparation.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      /*
        First remove the user's previous selections.
        This allows students to change their preparations anytime.
      */
      const { error: deleteError } = await supabase
        .from("user_preparations")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) {
        setError(deleteError.message);
        setSaving(false);
        return;
      }

      /*
        Insert the currently selected preparations.
      */
      const rows = selected.map((learning_path_id) => ({
        user_id: user.id,
        learning_path_id,
      }));

      const { error: insertError } = await supabase
        .from("user_preparations")
        .insert(rows);

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();

    } catch (err) {
      console.error(err);
      setError("Unable to save your preparations.");
      setSaving(false);
    }
  }

  const filteredPaths = paths.filter(
    (path) =>
      path.name.toLowerCase().includes(search.toLowerCase()) ||
      path.category.toLowerCase().includes(search.toLowerCase())
  );

  function getIcon(category: string) {
    const value = category.toLowerCase();

    if (value.includes("school")) {
      return <BookOpen size={22} />;
    }

    if (value.includes("competitive")) {
      return <Trophy size={22} />;
    }

    if (value.includes("government")) {
      return <Landmark size={22} />;
    }

    return <Briefcase size={22} />;
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link href="/dashboard" className="flex items-center gap-2">
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

          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Back to Dashboard
          </Link>

        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <GraduationCap size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            What do you want to prepare for?
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Choose one or multiple learning goals. You can change them anytime.
          </p>

        </div>

        <div className="mx-auto mt-10 max-w-2xl">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search NEET, JEE, UPSC, SSC, Group exams..."
              className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-black placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

        </div>

        {error && (
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (

          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>

        ) : (

          <>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {filteredPaths.map((path) => {

                const isSelected = selected.includes(path.id);

                return (
                  <button
                    key={path.id}
                    type="button"
                    onClick={() => toggleSelection(path.id)}
                    className={`relative rounded-2xl border-2 p-6 text-left transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >

                    {isSelected && (
                      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check size={16} />
                      </div>
                    )}

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getIcon(path.category)}
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-blue-600">
                      {path.category}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      {path.name}
                    </h3>

                  </button>
                );
              })}

            </div>

            {filteredPaths.length === 0 && (
              <div className="py-16 text-center">

                <Search size={36} className="mx-auto text-slate-300" />

                <h3 className="mt-4 font-semibold text-slate-900">
                  No preparation found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  More exams and learning paths will be added continuously.
                </p>

              </div>
            )}

            <div className="sticky bottom-4 mt-10">

              <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">

                <div>
                  <p className="font-semibold text-slate-900">
                    {selected.length} preparation
                    {selected.length !== 1 ? "s" : ""} selected
                  </p>

                  <p className="text-sm text-slate-500">
                    You can add or remove preparations anytime.
                  </p>
                </div>

                <button
                  onClick={savePreparations}
                  disabled={saving || selected.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Continue"}
                  {!saving && <ArrowRight size={18} />}
                </button>

              </div>

            </div>

          </>
        )}

      </div>

    </main>
  );
}
