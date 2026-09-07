import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { COURSES } from "../config/courses";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCourse(course: (typeof COURSES)[number]) {
  console.log(`\n====================================`);
  console.log(`COURSE: ${course.name}`);
  console.log(`====================================`);

  // Check whether learning path already exists
  const { data: existingPath, error: findError } = await supabase
    .from("learning_paths")
    .select("id, slug")
    .eq("slug", course.slug)
    .maybeSingle();

  if (findError) {
    throw new Error(
      `Failed checking course ${course.slug}: ${findError.message}`
    );
  }

  let learningPathId: string;

  if (existingPath) {
    learningPathId = existingPath.id;
    console.log(`✓ Course already exists`);
  } else {
    const { data: newPath, error: insertError } = await supabase
      .from("learning_paths")
      .insert({
        name: course.name,
        slug: course.slug,
        description: course.description,
        category: course.category,
      })
      .select("id")
      .single();

    if (insertError || !newPath) {
      throw new Error(
        `Failed creating ${course.name}: ${insertError?.message}`
      );
    }

    learningPathId = newPath.id;
    console.log(`✓ Course created`);
  }

  // Create subjects
  for (let index = 0; index < course.subjects.length; index++) {
    const subject = course.subjects[index];

    const { data: existingSubject, error: subjectFindError } =
      await supabase
        .from("subjects")
        .select("id")
        .eq("learning_path_id", learningPathId)
        .eq("slug", subject.slug)
        .maybeSingle();

    if (subjectFindError) {
      throw new Error(
        `Failed checking subject ${subject.slug}: ${subjectFindError.message}`
      );
    }

    if (existingSubject) {
      console.log(`  ✓ ${subject.name} already exists`);
      continue;
    }

    const { error: subjectInsertError } = await supabase
      .from("subjects")
      .insert({
        learning_path_id: learningPathId,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
      });

    if (subjectInsertError) {
      throw new Error(
        `Failed creating subject ${subject.name}: ${subjectInsertError.message}`
      );
    }

    console.log(`  + Created ${subject.name}`);
  }
}

async function main() {
  console.log("\n====================================");
  console.log(" AURAGLANCE EDU COURSE SEEDER");
  console.log("====================================");

  let success = 0;
  let failed = 0;

  for (const course of COURSES) {
    try {
      await seedCourse(course);
      success++;
    } catch (error: any) {
      failed++;
      console.error(`\n✗ FAILED: ${course.name}`);
      console.error(error.message);
    }
  }

  console.log("\n====================================");
  console.log(" COURSE SEEDING COMPLETE");
  console.log("====================================");
  console.log(`Success: ${success}`);
  console.log(`Failed:  ${failed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
