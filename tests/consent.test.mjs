// tests/consent.test.mjs — a parent says yes (utils/consent.js)
import assert from "node:assert/strict";
import { needsParentConsent, isAdultByYear, birthDecades, yearsOf, parentAskMessage } from "../utils/consent.js";

const kid = { grade: 5, firstName: "Pratha" };
assert.equal(needsParentConsent(kid), true, "a student who signed up alone");
assert.equal(needsParentConsent({ ...kid, parentUids: ["p"] }), false, "linked to a parent");
assert.equal(needsParentConsent({ ...kid, classIds: ["c"] }), false, "in a class");
assert.equal(needsParentConsent({ ...kid, pendingClassIds: ["c"] }), false, "joined a class with the parent's form, waiting for the teacher");
assert.equal(needsParentConsent({ ...kid, isChild: true }), false, "a profile a parent made");
assert.equal(needsParentConsent({ ...kid, parentUids: [] , classIds: [] }), true, "empty lists don't count");
assert.equal(needsParentConsent({ firstName: "Mohit" }), false, "grown-ups have no class");
assert.equal(needsParentConsent(kid, { exempt: true }), false, "admin / testers");
assert.equal(needsParentConsent({ ...kid, isDemo: true }), false);
assert.equal(needsParentConsent(null), false, "not loaded yet");

const now = new Date(2026, 10, 6);
assert.equal(isAdultByYear(2008, now), true);
assert.equal(isAdultByYear(2009, now), false, "17 this year");
assert.equal(isAdultByYear(1984, now), true);
assert.equal(isAdultByYear(1900, now), false, "not a real year of birth");
assert.equal(isAdultByYear(null, now), false);
assert.deepEqual(birthDecades(now), [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]);
assert.deepEqual(yearsOf(2020, now), [2020, 2021, 2022, 2023, 2024, 2025, 2026]);

const m = parentAskMessage("Pratha Chilkoti");
assert.ok(m.startsWith("Pratha wants to learn on Apprec8"));
assert.ok(m.includes("Me → Link my child's own account") && m.includes("Send Pratha the 6-number code"));
assert.ok(!m.includes("Chilkoti"), "first name only");
console.log("consent tests passed");
