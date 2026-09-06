import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

type Topic = {
  title?: string;
  content?: string;
  key_points?: string[];
  examples?: string[];
  rules?: string[];
  applications?: string[];
  types?: string[];
  table?: Record<string, string>[];
};

type ConceptContent = {
  introduction: string;
  topics: Topic[];
  summary: string[];
  neet_focus: string[];
};


type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

type NotesContent = {
  quick_revision: {
    heading: string;
    points: string[];
  }[];
  one_minute_revision: string[];
};

async function generateContent(
  subject: string,
  chapterName: string,
  chapterDescription: string | null
) {
  const prompt = `
You are an expert Indian NEET-UG educational content writer.

Create original, accurate, exam-focused educational content for:

Subject: ${subject}
Chapter: ${chapterName}
Description: ${chapterDescription || "Not provided"}

The content must be aligned with NEET-UG preparation level.

IMPORTANT RULES:
- Write original educational explanations.
- Do not copy NCERT or copyrighted coaching material.
- Be scientifically accurate.
- Cover the chapter comprehensively.
- Use clear language suitable for Class 11 and Class 12 students.
- Focus on concepts frequently relevant to NEET.
- Include formulas only when applicable.
- Do not mention that you are an AI.
- Do not include markdown formatting.

Return ONLY valid JSON.

Use exactly this structure:

{
  "concept": {
    "introduction": "Detailed chapter introduction",
    "topics": [
      {
        "title": "Topic title",
        "content": "Detailed explanation",
        "key_points": ["point 1", "point 2"],
        "examples": ["example 1"],
        "applications": ["application if applicable"]
      }
    ],
    "summary": ["summary point 1"],
    "neet_focus": ["important exam point 1"]
  },
  "notes": {
    "quick_revision": [
      {
        "heading": "Heading",
        "points": ["point 1", "point 2"]
      }
    ],
    "one_minute_revision": [
      "very important quick point"
    ]
  },
  "quiz": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correct_answer": "Exact correct option text",
      "explanation": "Short explanation of why the answer is correct"
    }
  ]
}

QUALITY REQUIREMENTS:

CONCEPT:
- Minimum 8 meaningful topics.
- Each topic should genuinely teach the concept.
- Include important definitions.
- Include examples where useful.
- Include key points for every topic.
- Include important formulas where relevant.
- Include common NEET traps or misconceptions when relevant.

NOTES:
- Minimum 6 revision sections.
- Make notes concise but useful.
- Include formulas, definitions and exceptions.
- One minute revision should contain 8-15 high-yield points.

Do not create fake facts.
QUIZ:
- Create exactly 10 NEET-style multiple-choice questions.
- Each question must have exactly 4 options.
- Only one option must be correct.
- correct_answer must exactly match one of the four options.
- Cover different important concepts from the chapter.
- Include conceptual and application-based questions.
- Avoid duplicate questions.
- Do not create misleading or ambiguous questions.
- Keep explanations concise and educational.
- Questions must be scientifically accurate.

Return valid JSON only.
`;

  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: prompt,
  });

  const text = response.output_text;

  try {
    return JSON.parse(text) as {
      concept: ConceptContent;
      notes: NotesContent;
      quiz: QuizQuestion[];
    };
  } catch {
    console.error("AI RESPONSE:");
    console.error(text);
    throw new Error("Failed to parse AI response as JSON");
  }
}


async function generateChapter(
  learningPath: any,
  subjectSlug: string,
  chapterNumber: number
) {
  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("id, name, slug")
    .eq("learning_path_id", learningPath.id)
    .eq("slug", subjectSlug)
    .single();

  if (subjectError || !subject) {
    throw new Error(`Subject '${subjectSlug}' not found`);
  }

  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("*")
    .eq("subject_id", subject.id)
    .eq("chapter_order", chapterNumber)
    .single();

  if (chapterError || !chapter) {
    throw new Error(
      `Chapter ${chapterNumber} not found for ${subject.name}`
    );
  }

  console.log(`\nFound chapter: ${chapter.name}`);

  const { data: existingContent } = await supabase
    .from("chapter_content")
    .select("id, content_type")
    .eq("learning_path_id", learningPath.id)
    .eq("subject_slug", subjectSlug)
    .eq("chapter_number", chapterNumber)
    .eq("language_code", "en")
    .eq("is_published", true);

  const existingTypes = new Set(
    (existingContent || []).map((item: any) => item.content_type)
  );

  // Check whether quiz questions already exist
  const { count: quizCount, error: quizCountError } = await supabase
    .from("chapter_quizzes")
    .select("*", { count: "exact", head: true })
    .eq("learning_path_id", learningPath.id)
    .eq("subject_slug", subjectSlug)
    .eq("chapter_number", chapterNumber)
    .eq("language_code", "en");

  if (quizCountError) {
    console.warn(
      `Warning: Could not check quiz status: ${quizCountError.message}`
    );
  }

  const hasQuiz = !quizCountError && (quizCount || 0) > 0;

  if (
    existingTypes.has("concept") &&
    existingTypes.has("notes") &&
    hasQuiz
  ) {
    console.log("✓ Already complete — skipping");
    return {
      status: "skipped",
      chapter: chapter.name,
    };
  }

  if (
    existingTypes.has("concept") &&
    existingTypes.has("notes") &&
    !hasQuiz
  ) {
    console.log("✓ Concept + Notes exist, but Quiz is missing.");
    console.log("Generating quiz...");
  }

  console.log("Generating educational content...");
  console.log("This may take a minute...");

  const generated = await generateContent(
    subject.name,
    chapter.name,
    chapter.description
  );

  console.log("Content generated successfully.");

  const rows: any[] = [
    {
      learning_path_id: learningPath.id,
      subject_slug: subjectSlug,
      chapter_number: chapterNumber,
      content_type: "concept",
      title: `${chapter.name} - Complete Concepts`,
      content: generated.concept,
      source_name: "AuraGlance EDU Original Content",
      source_url: null,
      language_code: "en",
      is_published: true,
    },
    {
      learning_path_id: learningPath.id,
      subject_slug: subjectSlug,
      chapter_number: chapterNumber,
      content_type: "notes",
      title: `${chapter.name} - Revision Notes`,
      content: generated.notes,
      source_name: "AuraGlance EDU Original Content",
      source_url: null,
      language_code: "en",
      is_published: true,
    },
  ];

  for (const row of rows) {
    const { error } = await supabase
      .from("chapter_content")
      .upsert(row, {
        onConflict:
          "learning_path_id,subject_slug,chapter_number,content_type,language_code",
      });

    if (error) {
      throw new Error(
        `Failed saving ${row.content_type}: ${error.message}`
      );
    }

    console.log(`✓ Saved: ${row.content_type}`);
  }

  await saveQuiz(
    learningPath.id,
    subject.id,
    subjectSlug,
    chapterNumber,
    generated.quiz
  );

  return {
    status: "generated",
    chapter: chapter.name,
  };
}


async function getLearningPath() {
  const { data: learningPath, error } = await supabase
    .from("learning_paths")
    .select("id, name, slug")
    .eq("slug", "neet")
    .single();

  if (error || !learningPath) {
    throw new Error("NEET learning path not found");
  }

  return learningPath;
}


async function generateSubject(
  learningPath: any,
  subjectSlug: string
) {
  const { data: subject, error } = await supabase
    .from("subjects")
    .select("id, name, slug")
    .eq("learning_path_id", learningPath.id)
    .eq("slug", subjectSlug)
    .single();

  if (error || !subject) {
    throw new Error(`Subject '${subjectSlug}' not found`);
  }

  const { data: chapters, error: chaptersError } = await supabase
    .from("chapters")
    .select("chapter_order, name")
    .eq("subject_id", subject.id)
    .eq("is_active", true)
    .order("chapter_order");

  if (chaptersError || !chapters || chapters.length === 0) {
    throw new Error(`No chapters found for ${subject.name}`);
  }

  console.log("\n====================================");
  console.log(` ${subject.name.toUpperCase()} BULK GENERATION`);
  console.log("====================================");
  console.log(`Total chapters: ${chapters.length}\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];

    console.log(
      `\n[${i + 1}/${chapters.length}] ${subject.name} → ${chapter.name}`
    );

    try {
      const result = await generateChapter(
        learningPath,
        subjectSlug,
        chapter.chapter_order
      );

      if (result.status === "generated") {
        generated++;
      } else {
        skipped++;
      }
    } catch (error: any) {
      failed++;

      console.error(
        `✗ Failed: ${chapter.name}`
      );
      console.error(error.message);

      console.log("Continuing to next chapter...");
    }

    // Small pause between API calls
    if (i < chapters.length - 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );
    }
  }

  console.log("\n====================================");
  console.log(` ${subject.name.toUpperCase()} COMPLETE`);
  console.log("====================================");
  console.log(`Generated: ${generated}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Failed:    ${failed}`);

  return {
    generated,
    skipped,
    failed,
  };
}



async function saveQuiz(
  learningPathId: string,
  subjectId: string,
  subjectSlug: string,
  chapterNumber: number,
  quiz: QuizQuestion[]
) {
  console.log("\nSaving quiz questions...");

  const rows = quiz.map((item, index) => ({
    learning_path_id: learningPathId,
    subject_id: subjectId,
    subject_slug: subjectSlug,
    chapter_number: chapterNumber,
    question_order: index + 1,
    question: item.question,
    options: item.options,
    correct_answer: item.correct_answer,
    explanation: item.explanation,
    language_code: "en",
    is_published: true,
  }));

  const { error } = await supabase
    .from("chapter_quizzes")
    .upsert(rows, {
      onConflict:
        "learning_path_id,subject_slug,chapter_number,question_order,language_code",
    });

  if (error) {
    throw new Error(`Failed saving quiz: ${error.message}`);
  }

  console.log(`✓ Saved ${rows.length} quiz questions`);
}

async function main() {
  const args = process.argv.slice(2);

  console.log("\n====================================");
  console.log(" AURAGLANCE EDU CONTENT GENERATOR");
  console.log("====================================\n");

  const learningPath = await getLearningPath();

  // MODE 1: Generate everything
  if (args.length === 1 && args[0] === "all") {
    console.log("MODE: COMPLETE NEET SYLLABUS\n");

    const subjects = ["physics", "chemistry", "biology"];

    let totalGenerated = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    for (const subjectSlug of subjects) {
      const result = await generateSubject(
        learningPath,
        subjectSlug
      );

      totalGenerated += result.generated;
      totalSkipped += result.skipped;
      totalFailed += result.failed;
    }

    console.log("\n====================================");
    console.log(" COMPLETE NEET GENERATION FINISHED");
    console.log("====================================");
    console.log(`Generated: ${totalGenerated}`);
    console.log(`Skipped:   ${totalSkipped}`);
    console.log(`Failed:    ${totalFailed}`);

    return;
  }

  const subjectSlug = args[0];
  const chapterArg = args[1];

  // MODE 2: Entire subject
  if (subjectSlug && chapterArg === "all") {
    await generateSubject(
      learningPath,
      subjectSlug
    );

    return;
  }

  // MODE 3: Single chapter
  const chapterNumber = Number(chapterArg);

  if (!subjectSlug || !chapterNumber) {
    console.log("Usage:");
    console.log("  npm run generate:neet -- physics 1");
    console.log("  npm run generate:neet -- physics all");
    console.log("  npm run generate:neet -- all");
    process.exit(1);
  }

  console.log(`Subject: ${subjectSlug}`);
  console.log(`Chapter: ${chapterNumber}`);

  const result = await generateChapter(
    learningPath,
    subjectSlug,
    chapterNumber
  );

  if (result.status === "generated") {
    console.log("\n====================================");
    console.log(" SUCCESS!");
    console.log("====================================");
    console.log(`Generated content for:`);
    console.log(`${subjectSlug} → ${result.chapter}`);
    console.log("\nConcept + Notes saved to Supabase.");
  }
}


main().catch((error) => {
  console.error("\nFATAL ERROR:");
  console.error(error.message);
  process.exit(1);
});
