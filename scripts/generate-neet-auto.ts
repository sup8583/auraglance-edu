import { spawn } from "child_process";

const subjects = ["physics", "chemistry", "biology"];

function runSubject(subject: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("\n");
    console.log("====================================");
    console.log(` STARTING ${subject.toUpperCase()}`);
    console.log("====================================\n");

    const child = spawn(
      "npx",
      ["tsx", "scripts/generate-neet-content.ts", subject, "all"],
      {
        stdio: "inherit",
        shell: true,
      }
    );

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`\n✓ ${subject.toUpperCase()} FINISHED`);
        resolve();
      } else {
        console.error(
          `\n✗ ${subject.toUpperCase()} finished with exit code ${code}`
        );
        console.log("Continuing to next subject...");
        resolve();
      }
    });

    child.on("error", (error) => {
      console.error(
        `Failed to start ${subject}: ${error.message}`
      );
      resolve();
    });
  });
}

async function main() {
  console.log("\n====================================");
  console.log(" AURAGLANCE EDU AUTO GENERATOR");
  console.log(" COMPLETE NEET SYLLABUS");
  console.log("====================================");

  console.log("\nSubjects:");
  subjects.forEach((subject, index) => {
    console.log(`${index + 1}. ${subject}`);
  });

  console.log(
    "\nSmart generation will skip completed chapters automatically."
  );

  const startTime = Date.now();

  for (const subject of subjects) {
    await runSubject(subject);
  }

  const duration = Math.round(
    (Date.now() - startTime) / 1000 / 60
  );

  console.log("\n====================================");
  console.log(" AURAGLANCE EDU AUTO GENERATION DONE");
  console.log("====================================");
  console.log(`Total duration: ${duration} minutes`);
}

main().catch((error) => {
  console.error("\nFATAL ERROR:");
  console.error(error);
  process.exit(1);
});
