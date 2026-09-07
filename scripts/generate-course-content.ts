import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiKey = process.env.OPENAI_API_KEY!;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or OPENAI_API_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: openaiKey,
});

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

type GeneratedContent = {
  concept: string;
  notes: string;
  quiz: QuizQuestion[];
};

async function generateContent(
  courseName: string,
  subjectName: string,
  chapterName: string,
  chapterDescription: string
): Promise<GeneratedContent> {
  const prompt = `
You are an expert educational content creator.

Create high-quality study material for the following competitive examination.

COURSE:
${courseName}

SUBJECT:
${subjectName}

CHAPTER:
${chapterName}

DESCRIPTION:
${chapterDescription || "No description available"}

Return ONLY valid JSON in this exact format:

{
  "concept": "Detailed educational explanation in markdown",
  "notes": "Concise revision notes in markdown",
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
      "explanation": "Brief explanation"
    }
  ]
}

CONTENT REQUIREMENTS:

CONCEPT:
- Explain from beginner to advanced level.
- Use clear headings.
- Include examples.
- Include formulas where relevant.
- Include important exam concepts.
- Avoid fake facts.
- Make the content suitable specifically for ${courseName}.
- Minimum 1500 words where the chapter requires detailed explanation.

NOTES:
- Create concise revision notes.
- Minimum 6 sections.
- Include formulas where relevant.
- Include definitions.
- Include exceptions and important facts.
- Include exam traps or common mistakes.
- End with a "Quick Revision" section containing 8-15 high-yield points.

QUIZ:
- Generate exactly 10 questions.
- Each question must have exactly 4 options.
- Questions should match ${courseName} exam difficulty.
- Mix easy, medium and difficult questions.
- correct_answer must exactly match one of the options.
- Include a useful explanation.

Return JSON only.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    response_format: {
      type: "json_object",
    },
  });

  const text = response.choices[0]?.message?.content;

  if (!text) {
    throw new Error("Empty AI response");
  }

  try {
    // Remove markdown code fences if AI returns them
    let cleanText = text.trim();

    cleanText = cleanText
      .replace(/^```json\\s*/i, "")
      .replace(/^```\\s*/i, "")
      .replace(/\\s*```$/, "")
      .trim();

    // Extract JSON object in case extra text exists
    const firstBrace = cleanText.indexOf("{");
    const lastBrace = cleanText.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleanText);

    if (
      !parsed.concept ||
      !parsed.notes ||
      !Array.isArray(parsed.quiz)
    ) {
      throw new Error("Invalid AI response structure");
    }

    return parsed as GeneratedContent;

  } catch (error) {
    console.error("\\nAI RESPONSE PARSE ERROR:");
    console.error(error);
    console.error("\\nRAW AI RESPONSE:");
    console.error(text);

    throw new Error("Failed to parse AI response as JSON");
  }
}

async function getCourse(courseSlug: string) {
  const { data, error } = await supabase
    .from("learning_paths")
    .select("id, name, slug")
    .eq("slug", courseSlug)
    .single();

  if (error || !data) {
    throw new Error(`Course '${courseSlug}' not found`);
  }

  return data;
}

async function getSubjects(courseId: string) {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, slug, description")
    .eq("learning_path_id", courseId)
    .order("name");

  if (error) {
    throw new Error(`Failed fetching subjects: ${error.message}`);
  }

  return data || [];
}

async function getChapters(subjectId: string) {
  const { data, error } = await supabase
    .from("chapters")
    .select("id, name, slug, chapter_order, description")
    .eq("subject_id", subjectId)
    .eq("is_active", true)
    .order("chapter_order");

  if (error) {
    throw new Error(`Failed fetching chapters: ${error.message}`);
  }

  return data || [];
}

async function saveContent(
  courseId: string,
  subjectSlug: string,
  chapterNumber: number,
  chapterName: string,
  concept: string,
  notes: string
) {
  const rows = [
    {
      learning_path_id: courseId,
      subject_slug: subjectSlug,
      chapter_number: chapterNumber,
      content_type: "concept",
      title: chapterName,
      content: concept,
      language_code: "en",
      is_published: true,
    },
    {
      learning_path_id: courseId,
      subject_slug: subjectSlug,
      chapter_number: chapterNumber,
      content_type: "notes",
      title: `${chapterName} - Revision Notes`,
      content: notes,
      language_code: "en",
      is_published: true,
    },
  ];

  const { error } = await supabase
    .from("chapter_content")
    .upsert(rows, {
      onConflict:
        "learning_path_id,subject_slug,chapter_number,content_type,language_code",
    });

  if (error) {
    throw new Error(`Failed saving content: ${error.message}`);
  }
}

async function saveQuiz(
  courseId: string,
  subjectId: string,
  subjectSlug: string,
  chapterNumber: number,
  quiz: QuizQuestion[]
) {
  const rows = quiz.map((item, index) => ({
    learning_path_id: courseId,
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
}

async function checkExisting(
  courseId: string,
  subjectSlug: string,
  chapterNumber: number
) {
  const { data: content } = await supabase
    .from("chapter_content")
    .select("content_type")
    .eq("learning_path_id", courseId)
    .eq("subject_slug", subjectSlug)
    .eq("chapter_number", chapterNumber)
    .eq("language_code", "en")
    .eq("is_published", true);

  const { count: quizCount } = await supabase
    .from("chapter_quizzes")
    .select("*", { count: "exact", head: true })
    .eq("learning_path_id", courseId)
    .eq("subject_slug", subjectSlug)
    .eq("chapter_number", chapterNumber)
    .eq("language_code", "en")
    .eq("is_published", true);

  const types = new Set(
    (content || []).map((item: any) => item.content_type)
  );

  return {
    concept: types.has("concept"),
    notes: types.has("notes"),
    quiz: (quizCount || 0) >= 10,
  };
}

async function generateChapter(
  course: any,
  subject: any,
  chapter: any
) {
  console.log(`\n${subject.name} → ${chapter.name}`);

  const existing = await checkExisting(
    course.id,
    subject.slug,
    chapter.chapter_order
  );

  if (existing.concept && existing.notes && existing.quiz) {
    console.log("✓ Already complete — skipping");

    return "skipped";
  }

  console.log("Generating educational content...");
  console.log("This may take a minute...");

  const generated = await generateContent(
    course.name,
    subject.name,
    chapter.name,
    chapter.description
  );

  if (!existing.concept || !existing.notes) {
    await saveContent(
      course.id,
      subject.slug,
      chapter.chapter_order,
      chapter.name,
      generated.concept,
      generated.notes
    );

    console.log("✓ Concept + Notes saved");
  }

  if (!existing.quiz) {
    await saveQuiz(
      course.id,
      subject.id,
      subject.slug,
      chapter.chapter_order,
      generated.quiz
    );

    console.log("✓ 10 Quiz questions saved");
  }

  return "generated";
}

async function generateCourse(courseSlug: string) {
  console.log("\n====================================");
  console.log(" AURAGLANCE EDU COURSE GENERATOR");
  console.log("====================================\n");

  const course = await getCourse(courseSlug);

  console.log(`COURSE: ${course.name}`);
  console.log(`SLUG: ${course.slug}\n`);

  const subjects = await getSubjects(course.id);

  if (!subjects.length) {
    throw new Error(`No subjects found for ${course.name}`);
  }

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const subject of subjects) {
    console.log("\n====================================");
    console.log(`SUBJECT: ${subject.name}`);
    console.log("====================================");

    const chapters = await getChapters(subject.id);

    console.log(`Found ${chapters.length} chapters`);

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];

      console.log(
        `\n[${i + 1}/${chapters.length}] ${subject.name} → ${chapter.name}`
      );

      try {
        const result = await generateChapter(
          course,
          subject,
          chapter
        );

        if (result === "generated") generated++;
        else skipped++;
      } catch (error: any) {
        failed++;

        console.error(`✗ Failed: ${chapter.name}`);
        console.error(error.message);
      }

      // Avoid API rate limits
      if (i < chapters.length - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );
      }
    }
  }

  console.log("\n====================================");
  console.log(` ${course.name.toUpperCase()} COMPLETE`);
  console.log("====================================");
  console.log(`Generated: ${generated}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Failed:    ${failed}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (!args.length) {
    console.log("\nUsage:");
    console.log("npm run generate:course -- <course-slug> all\n");

    console.log("Examples:");
    console.log("npm run generate:course -- jee-main all");
    console.log("npm run generate:course -- gate-cse all");
    console.log("npm run generate:course -- upsc all");

    process.exit(1);
  }

  const courseSlug = args[0];

  await generateCourse(courseSlug);
}

main().catch((error) => {
  console.error("\nFATAL ERROR:");
  console.error(error.message);
  process.exit(1);
});
