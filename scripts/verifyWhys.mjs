// scripts/verifyWhys.mjs: verify option-level rationales (G83)
import fs from "fs";

const units = ["b1", "b2", "b3", "b4", "b5", "b6"];
let totalQuestions = 0;
let totalWithAllWhys = 0;
let totalOptions = 0;
let totalWhys = 0;
let wordCountErrors = [];
let missingWhys = [];

for (const u of units) {
  const mod = (await import(`../data/englishQuest/units/${u}.js`)).default;
  let unitQuestions = 0;
  let unitWhys = 0;

  for (const [quizId, qs] of Object.entries(mod.quizzes || {})) {
    for (let idx = 0; idx < qs.length; idx++) {
      const q = qs[idx];
      unitQuestions++;
      totalQuestions++;

      const wrongOpts = (q.options || []).filter((o) => !o.isCorrect);
      let qHasAllWhys = true;

      for (const opt of wrongOpts) {
        totalOptions++;
        if (opt.why && typeof opt.why === "string" && opt.why.trim().length > 0) {
          totalWhys++;
          unitWhys++;
          const words = opt.why.trim().split(/\s+/).length;
          if (words > 20) {
            wordCountErrors.push({
              unit: u,
              quizId,
              qIndex: idx,
              optText: opt.content,
              words,
              why: opt.why,
            });
          }
        } else {
          qHasAllWhys = false;
          missingWhys.push({
            unit: u,
            quizId,
            qIndex: idx,
            qText: q.question?.content,
            optText: opt.content,
          });
        }
      }

      if (qHasAllWhys && wrongOpts.length > 0) {
        totalWithAllWhys++;
      }
    }
  }

  console.log(`${u}: ${unitQuestions} questions, ${unitWhys} whys`);
}

console.log("\n--- SUMMARY ---");
console.log(`Total questions: ${totalQuestions}`);
console.log(`Questions with all whys: ${totalWithAllWhys}`);
console.log(`Total wrong options: ${totalOptions}`);
console.log(`Total whys populated: ${totalWhys}`);
console.log(`Word count > 20 violations: ${wordCountErrors.length}`);
console.log(`Missing whys count: ${missingWhys.length}`);

if (wordCountErrors.length > 0) {
  console.log("\nWord count violations:");
  wordCountErrors.slice(0, 10).forEach((e) => {
    console.log(`  [${e.unit}/${e.quizId} #${e.qIndex}] (${e.words}w): "${e.why}"`);
  });
}
