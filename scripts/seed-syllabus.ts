import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { SYLLABUS } from "../config/syllabus";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function seedCourse(courseSlug: string) {
  console.log(`\n====================================`);
  console.log(`COURSE: ${courseSlug.toUpperCase()}`);
  console.log(`====================================`);

  const { data: path, error: pathError } = await supabase
    .from("learning_paths")
    .select("id, name")
    .eq("slug", courseSlug)
    .single();

  if (pathError || !path) {
    throw new Error(`Course not found: ${courseSlug}`);
  }

  const syllabus = SYLLABUS[courseSlug];

  for (const [subjectSlug, chapterList] of Object.entries(syllabus)) {
    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .select("id, name")
      .eq("learning_path_id", path.id)
      .eq("slug", subjectSlug)
      .single();

    if (subjectError || !subject) {
      console.error(`✗ Subject not found: ${subjectSlug}`);
      continue;
    }

    console.log(`\n${subject.name}`);

    for (let index = 0; index < chapterList.length; index++) {
      const chapter = chapterList[index];
      const chapterSlug = slugify(chapter.name);

      const { data: existing } = await supabase
        .from("chapters")
        .select("id")
        .eq("subject_id", subject.id)
        .eq("slug", chapterSlug)
        .maybeSingle();

      if (existing) {
        console.log(`  ✓ ${chapter.name}`);
        continue;
      }

      const { error: insertError } = await supabase
        .from("chapters")
        .insert({
          subject_id: subject.id,
          name: chapter.name,
          slug: chapterSlug,
          chapter_order: index + 1,
          description: chapter.description,
          is_active: true,
        });

      if (insertError) {
        console.error(
          `  ✗ Failed ${chapter.name}: ${insertError.message}`
        );
      } else {
        console.log(`  + ${chapter.name}`);
      }
    }
  }
}

async function main() {
  console.log("\n====================================");
  console.log(" AURAGLANCE EDU SYLLABUS SEEDER");
  console.log("====================================");

  let completed = 0;
  let failed = 0;

  for (const courseSlug of Object.keys(SYLLABUS)) {
    try {
      await seedCourse(courseSlug);
      completed++;
    } catch (error: any) {
      failed++;
      console.error(`\nFAILED: ${courseSlug}`);
      console.error(error.message);
    }
  }

  console.log("\n====================================");
  console.log(" SYLLABUS SEEDING COMPLETE");
  console.log("====================================");
  console.log(`Completed: ${completed}`);
  console.log(`Failed:    ${failed}`);
}

main();
