// Tests for the class link helpers (utils/joinLink.js + its server copy functions/utils/joinLink.js). Run: npm test
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { parseJoinLink, isJoinToken, joinUrl, classLinkMessage, normalizeMobile, formatMobile, whatsappUrl, telUrl, normalizeRoll, joinPayload, TOKEN_CHARS, TOKEN_LENGTH } from "../utils/joinLink.js";

const require = createRequire(import.meta.url);
const server = require("../functions/utils/joinLink.js");

// tokens: server-made tokens are valid for the app, and links of both kinds parse
for (let i = 0; i < 50; i++) {
  const t = server.makeToken();
  assert.equal(t.length, TOKEN_LENGTH);
  assert.ok(isJoinToken(t), t);
  assert.ok(server.isJoinToken(t), t);
  assert.ok(![...t].some((c) => "01ilo".includes(c)), `no look-alikes: ${t}`);
}
assert.equal(server.TOKEN_CHARS, TOKEN_CHARS);
assert.equal(parseJoinLink("https://apprec8-ca229.web.app/j/k3x9m2p7qa"), "k3x9m2p7qa");
assert.equal(parseJoinLink("https://apprec8.web.app/j/K3X9M2P7QA/"), "k3x9m2p7qa");
assert.equal(parseJoinLink("https://apprec8.web.app/j/k3x9m2p7qa?utm=wa"), "k3x9m2p7qa");
assert.equal(parseJoinLink("apprec8://join/k3x9m2p7qa"), "k3x9m2p7qa");
assert.equal(parseJoinLink("apprec8://redirect?x=1"), null); // Google sign-in returns use this; not ours
assert.equal(parseJoinLink("https://apprec8.web.app/j/short"), null);
assert.equal(parseJoinLink("https://apprec8.web.app/j/k3x9m2p7q0"), null); // "0" never appears
assert.equal(parseJoinLink(null), null);
assert.equal(joinUrl("https://apprec8-ca229.web.app/j/", "k3x9m2p7qa"), "https://apprec8-ca229.web.app/j/k3x9m2p7qa");

// the WhatsApp message carries the link and says the teacher approves
const msg = classLinkMessage({ className: "10-A", schoolName: "Demo School", teacherName: "Seema Ma'am", url: "https://x/j/k3x9m2p7qa" });
assert.ok(msg.includes("https://x/j/k3x9m2p7qa"));
assert.ok(msg.includes("10-A, Demo School"));
assert.ok(msg.includes("Seema Ma'am approves every child"));
assert.ok(!/code/i.test(msg), "no codes to type");

// mobile numbers: app and server agree
const cases = [
  ["98765 43210", "+919876543210"],
  ["098765-43210", "+919876543210"],
  ["919876543210", "+919876543210"],
  ["+91 98765 43210", "+919876543210"],
  ["(987) 654-3210", "+919876543210"],
  ["12345 67890", null], // Indian mobiles start with 6–9
  ["+91 12345 67890", null],
  ["9876543", null],
  ["+1 415 555 0100", "+14155550100"], // families abroad
  ["+44 7700 900123", "+447700900123"],
  ["+12", null],
  ["abc", null],
  ["", null],
];
for (const [input, want] of cases) {
  assert.equal(normalizeMobile(input), want, input);
  assert.equal(server.normalizeMobile(input), want, `server: ${input}`);
}
assert.equal(formatMobile("+919876543210"), "98765 43210");
assert.equal(formatMobile("+14155550100"), "+14155550100");
assert.equal(whatsappUrl("+919876543210"), "https://wa.me/919876543210");
assert.equal(telUrl("+919876543210"), "tel:+919876543210");

// roll numbers: optional, short
for (const [input, want] of [["23", "23"], [" 12 b ", "12B"], ["", ""], ["1234567", null], ["2/3", null]]) {
  assert.equal(normalizeRoll(input), want, input);
  assert.equal(server.normalizeRoll(input), want, `server: ${input}`);
}

// the join form
const ok = { token: "k3x9m2p7qa", firstName: " riya  sharma ", rollNo: "23", mobile: "98765 43210", relation: "mother", agreed: true, language: "en", version: "2026-11-04" };
assert.deepEqual(joinPayload(ok), { token: "k3x9m2p7qa", firstName: "riya", rollNo: "23", mobile: "+919876543210", relation: "mother", language: "en", version: "2026-11-04" });
assert.deepEqual(joinPayload({ ...ok, firstName: "", kidUid: "kid1" }).kidUid, "kid1");
assert.equal("firstName" in joinPayload({ ...ok, kidUid: "kid1" }), false, "an existing child sends only its id");
assert.throws(() => joinPayload({ ...ok, firstName: "R" }), /first name/);
assert.throws(() => joinPayload({ ...ok, mobile: "123" }), /mobile/);
assert.throws(() => joinPayload({ ...ok, relation: "uncle" }), /mother/);
assert.throws(() => joinPayload({ ...ok, agreed: false }), /agree/);
assert.throws(() => joinPayload({ ...ok, token: "bad" }), /link/);
assert.throws(() => joinPayload({ ...ok, rollNo: "1234567" }), /roll/);

console.log("joinLink tests passed");

// A class picked in the app (owner, 12 Nov): classId instead of a link token.
assert.deepEqual(joinPayload({ ...ok, token: undefined, classId: "c10a" }).classId, "c10a");
assert.equal(joinPayload({ ...ok, token: undefined, classId: "c10a" }).token, undefined);
assert.throws(() => joinPayload({ ...ok, token: undefined }), /link/);
console.log("joinLink: picked class ok");

// One invite for every teacher (owner, 12 Nov): steps end at "Join your class"; no class link in it.
{
  const { inviteMessage } = await import("../utils/joinLink.js");
  const m = inviteMessage({ className: "10-A", schoolName: "Appreciate International School", teacherName: "Seema", storeUrl: "https://play/x", testing: { groupUrl: "https://g", optInUrl: "https://o" } });
  assert.ok(m.includes("1. Join the testers group: https://g") && m.includes("2. Become a tester: https://o") && m.includes("3. Install Apprec8: https://play/x"));
  assert.ok(m.includes('4. Open Apprec8 → tap "Join your class" → Appreciate International School → 10-A'));
  assert.ok(!/\/j\//.test(m), "no old class link");
  const pub = inviteMessage({ className: "10-A", schoolName: "S", storeUrl: "https://play/x" });
  assert.ok(pub.startsWith("Namaste!") && pub.includes("1. Install Apprec8") && !pub.includes("tester"), "public: install is step 1");
  console.log("joinLink: invite message ok");
}
