import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ============================================
// PROGRESS
// ============================================

export async function updateModuleProgress({
  userId,
  learningPathId,
  subjectId,
  chapterId,
  moduleType,
  completed = true,
  progressPercentage = 100,
}: {
  userId: string;
  learningPathId: string;
  subjectId: string;
  chapterId: string;
  moduleType: "concepts" | "notes" | "quiz";
  completed?: boolean;
  progressPercentage?: number;
}) {
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      learning_path_id: learningPathId,
      subject_id: subjectId,
      chapter_id: chapterId,
      module_type: moduleType,
      completed,
      progress_percentage: progressPercentage,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,chapter_id,module_type",
    }
  );

  if (error) throw error;

  await updateUserStreak(userId);
}

// ============================================
// QUIZ ATTEMPTS
// ============================================

export async function saveQuizAttempt({
  userId,
  learningPathId,
  subjectId,
  chapterId,
  totalQuestions,
  correctAnswers,
  answers,
}: {
  userId: string;
  learningPathId: string;
  subjectId: string;
  chapterId: string;
  totalQuestions: number;
  correctAnswers: number;
  answers: unknown;
}) {
  const scorePercentage = Math.round(
    (correctAnswers / totalQuestions) * 100
  );

  const { error } = await supabase
    .from("user_quiz_attempts")
    .insert({
      user_id: userId,
      learning_path_id: learningPathId,
      subject_id: subjectId,
      chapter_id: chapterId,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score_percentage: scorePercentage,
      answers,
    });

  if (error) throw error;

  await updateModuleProgress({
    userId,
    learningPathId,
    subjectId,
    chapterId,
    moduleType: "quiz",
    completed: true,
  });

  await addXP(userId, 20);

  return scorePercentage;
}

// ============================================
// QUIZ ANALYTICS
// ============================================

export async function getQuizAnalytics(userId: string) {
  const { data, error } = await supabase
    .from("user_quiz_attempts")
    .select(`
      *,
      chapters (
        id,
        name,
        slug
      ),
      subjects (
        id,
        name,
        slug
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const attempts = data || [];

  const totalAttempts = attempts.length;

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce(
            (sum, attempt) => sum + attempt.score_percentage,
            0
          ) / totalAttempts
        )
      : 0;

  const weakChapters = attempts
    .filter((attempt) => attempt.score_percentage < 60)
    .slice(0, 5);

  const strongChapters = attempts
    .filter((attempt) => attempt.score_percentage >= 80)
    .slice(0, 5);

  return {
    totalAttempts,
    averageScore,
    weakChapters,
    strongChapters,
    attempts,
  };
}

// ============================================
// BOOKMARKS
// ============================================

export async function toggleBookmark({
  userId,
  learningPathId,
  subjectId,
  chapterId,
  moduleType,
}: {
  userId: string;
  learningPathId: string;
  subjectId: string;
  chapterId: string;
  moduleType?: string;
}) {
  let query = supabase
    .from("user_bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId);

  if (moduleType) {
    query = query.eq("module_type", moduleType);
  }

  const { data: existing, error: lookupError } =
    await query.maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    const { error } = await supabase
      .from("user_bookmarks")
      .delete()
      .eq("id", existing.id);

    if (error) throw error;

    return false;
  }

  const { error } = await supabase
    .from("user_bookmarks")
    .insert({
      user_id: userId,
      learning_path_id: learningPathId,
      subject_id: subjectId,
      chapter_id: chapterId,
      module_type: moduleType || null,
    });

  if (error) throw error;

  return true;
}

export async function getUserBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("user_bookmarks")
    .select(`
      *,
      chapters (
        id,
        name,
        slug
      ),
      subjects (
        id,
        name,
        slug
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

// ============================================
// STREAK SYSTEM
// ============================================

export async function updateUserStreak(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data: streak, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  if (!streak) {
    const { error: insertError } = await supabase
      .from("user_streaks")
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
        total_study_days: 1,
      });

    if (insertError) throw insertError;

    return;
  }

  if (streak.last_activity_date === today) {
    return;
  }

  const lastDate = new Date(streak.last_activity_date);
  const currentDate = new Date(today);

  const difference = Math.floor(
    (currentDate.getTime() - lastDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  let newStreak = 1;

  if (difference === 1) {
    newStreak = streak.current_streak + 1;
  }

  const newLongest = Math.max(
    streak.longest_streak,
    newStreak
  );

  const { error: updateError } = await supabase
    .from("user_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: today,
      total_study_days: streak.total_study_days + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (updateError) throw updateError;
}

export async function getUserStreak(userId: string) {
  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return (
    data || {
      current_streak: 0,
      longest_streak: 0,
      total_study_days: 0,
    }
  );
}

// ============================================
// XP SYSTEM
// ============================================

export async function addXP(
  userId: string,
  points: number
) {
  const { data: existing, error } = await supabase
    .from("user_xp")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  if (!existing) {
    const { error: insertError } = await supabase
      .from("user_xp")
      .insert({
        user_id: userId,
        total_xp: points,
        level: calculateLevel(points),
      });

    if (insertError) throw insertError;

    return;
  }

  const totalXP = existing.total_xp + points;

  const { error: updateError } = await supabase
    .from("user_xp")
    .update({
      total_xp: totalXP,
      level: calculateLevel(totalXP),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (updateError) throw updateError;
}

export function calculateLevel(xp: number) {
  if (xp >= 5000) return 5;
  if (xp >= 2500) return 4;
  if (xp >= 1000) return 3;
  if (xp >= 300) return 2;

  return 1;
}

export function getLevelName(level: number) {
  const levels: Record<number, string> = {
    1: "Beginner",
    2: "Learner",
    3: "Scholar",
    4: "Achiever",
    5: "Master",
  };

  return levels[level] || "Beginner";
}

export async function getUserXP(userId: string) {
  const { data, error } = await supabase
    .from("user_xp")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return (
    data || {
      total_xp: 0,
      level: 1,
    }
  );
}
