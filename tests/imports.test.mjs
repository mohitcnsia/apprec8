// Checks that every named import between our own files exists in the imported file.
// Catches "X is not a function (it is undefined)" crashes before they reach a device.
// Run: npm test
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parse } = require("@babel/parser");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIRS = ["screens", "components", "services", "utils", "hooks", "navigation", "context", "config", "data", "store"];
const EXTS = [".js", ".jsx", ".ts", ".tsx"];
// Known, not used by the app (dev-only tester screen). Remove from this list once deleted or fixed.
const KNOWN_DEAD_FILES = ["components/common/reader/Apprec8ReaderTester.js"];

const skipped = [];
const parseFile = (file) => {
  const ts = /\.tsx?$/.test(file);
  try {
    return parse(fs.readFileSync(file, "utf8"), {
      sourceType: "module",
      plugins: ts ? ["jsx", "typescript"] : ["jsx", "flow"],
      errorRecovery: true,
    });
  } catch (e) {
    skipped.push(`${path.relative(ROOT, file)} (${e.message})`);
    return { program: { body: [] } };
  }
};

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) return d.name === "node_modules" ? [] : walk(p);
        return EXTS.includes(path.extname(p)) ? [p] : [];
      })
    : [];

const resolveLocal = (from, spec) => {
  const base = path.resolve(path.dirname(from), spec);
  for (const c of [base, ...EXTS.map((e) => base + e), ...EXTS.map((e) => path.join(base, "index" + e))]) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
};

const exportCache = new Map();
const exportsOf = (file) => {
  if (exportCache.has(file)) return exportCache.get(file);
  const names = new Set();
  let hasStar = false;
  for (const node of parseFile(file).program.body) {
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration?.declarations) node.declaration.declarations.forEach((d) => d.id.name && names.add(d.id.name));
      else if (node.declaration?.id) names.add(node.declaration.id.name);
      node.specifiers?.forEach((s) => names.add(s.exported.name ?? s.exported.value));
    } else if (node.type === "ExportDefaultDeclaration") names.add("default");
    else if (node.type === "ExportAllDeclaration") hasStar = true;
  }
  const result = { names, hasStar };
  exportCache.set(file, result);
  return result;
};

const problems = [];
let checked = 0;
for (const file of DIRS.flatMap((d) => walk(path.join(ROOT, d)))) {
  for (const node of parseFile(file).program.body) {
    if (node.type !== "ImportDeclaration" || !node.source.value.startsWith(".")) continue;
    const target = resolveLocal(file, node.source.value);
    const rel = path.relative(ROOT, file);
    if (KNOWN_DEAD_FILES.includes(rel)) continue;
    if (target && !EXTS.includes(path.extname(target))) continue; // JSON, images, fonts
    if (!target) {
      if (!/\.(json|png|jpg|webp|gif|ttf|otf|mp3|wav|lottie)$/.test(node.source.value)) {
        problems.push(`${rel}: cannot find "${node.source.value}"`);
      }
      continue;
    }
    const { names, hasStar } = exportsOf(target);
    for (const s of node.specifiers) {
      const wanted = s.type === "ImportDefaultSpecifier" ? "default" : s.type === "ImportSpecifier" ? s.imported.name ?? s.imported.value : null;
      if (!wanted) continue; // import * as X
      checked++;
      if (!names.has(wanted) && !hasStar) {
        problems.push(`${rel}: imports "${wanted}" from "${node.source.value}", but it is not exported there`);
      }
    }
  }
}

if (problems.length) {
  console.error("Import check FAILED:\n  " + problems.join("\n  "));
  process.exit(1);
}
if (skipped.length) console.log("imports: could not parse (skipped):\n  " + skipped.join("\n  "));
console.log(`imports: ${checked} local imports checked, all exist`);
