// Checks data/fixes/ieoFixes.js against the saved copy of old IEO questions. Run: npm test
import assert from "node:assert/strict";
import fs from "node:fs";
import { IEO_FIXES } from "../data/fixes/ieoFixes.js";

const url = new URL("./fixtures/ieo_questions.json", import.meta.url);
if (!fs.existsSync(url)) {
  console.log("ieoFixes: no IEO snapshot, skipped");
} else {
  const old = JSON.parse(fs.readFileSync(url));
  const norm = (v) => String(v ?? "").trim().replace(/\s+/g, " ");
  const seen = new Set();
  for (const f of IEO_FIXES) {
    const tag = `${f.quizId} #${f.order}`;
    assert.ok(!seen.has(f.docId), `${tag}: fixed twice`);
    seen.add(f.docId);
    const q = (old[f.quizId] || []).find((x) => x._id === f.docId);
    assert.ok(q, `${tag}: document not found`);
    assert.equal(Number(q.order), f.order, `${tag}: order mismatch`);
    assert.equal(q.question, f.was, `${tag}: 'was' text mismatch`);
    const after = { ...q, ...f.set };
    const opts = after.options.map(norm);
    assert.ok(opts.length >= 3, `${tag}: needs 3+ options`);
    assert.equal(new Set(opts.map((o) => o.toLowerCase())).size, opts.length, `${tag}: duplicate options`);
    assert.equal(opts.filter((o) => o === norm(after.answer)).length, 1, `${tag}: answer must be exactly one option`);
    const ex = Array.isArray(after.explanation) ? after.explanation.join(" ") : String(after.explanation || "");
    assert.ok(ex.trim().length > 10, `${tag}: needs an explanation`);
    assert.ok(!/bitch/i.test(JSON.stringify(after)), `${tag}: not kid-friendly`);
    assert.ok(f.why, `${tag}: say why`);
  }
  console.log(`ieoFixes: ${IEO_FIXES.length} fixes OK`);
}
