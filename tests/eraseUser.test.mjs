// tests/eraseUser.test.mjs — "Delete my account" really deletes (functions/utils/eraseUser.js), on an in-memory Firestore.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { erasePlan, eraseUser } = require("../functions/utils/eraseUser.js");

// ---- tiny fake of the firebase-admin API used by eraseUser ----
const ARR_REMOVE = Symbol("arrayRemove"), DEL = Symbol("delete"), TS = Symbol("ts");
const FieldValue = { arrayRemove: (...v) => ({ [ARR_REMOVE]: v }), delete: () => DEL, serverTimestamp: () => TS };
function makeAdmin(seed) {
  const store = new Map(Object.entries(seed)); // "path" -> data
  const deletedAuth = [];
  const apply = (old = {}, patch) => {
    const out = { ...old };
    for (const [k, v] of Object.entries(patch)) {
      const [top, sub] = k.split(".");
      if (sub) {
        out[top] = { ...(out[top] || {}) };
        if (v === DEL) delete out[top][sub];
        else out[top][sub] = v;
      } else if (v === DEL) delete out[k];
      else if (v && v[ARR_REMOVE]) out[k] = (out[k] || []).filter((x) => !v[ARR_REMOVE].includes(x));
      else out[k] = v === TS ? "ts" : v;
    }
    return out;
  };
  const docRef = (path) => ({
    path,
    get: async () => ({ exists: store.has(path), data: () => store.get(path), ref: docRef(path) }),
    set: async (d, o) => store.set(path, o?.merge ? apply(store.get(path), d) : apply({}, d)),
    update: async (d) => {
      if (!store.has(path)) throw new Error("NOT_FOUND " + path);
      store.set(path, apply(store.get(path), d));
    },
    delete: async () => store.delete(path),
    collection: (c) => colRef(`${path}/${c}`),
  });
  const colRef = (path, filters = [], lim = Infinity, after = null) => ({
    doc: (id) => docRef(`${path}/${id}`),
    where: (f, op, v) => colRef(path, [...filters, [f, op, v]], lim, after),
    orderBy: () => colRef(path, filters, lim, after),
    startAfter: (d) => colRef(path, filters, lim, d.ref.path),
    limit: (n) => colRef(path, filters, n, after),
    get: async () => {
      const docs = [...store.keys()]
        .filter((k) => k.startsWith(path + "/") && !k.slice(path.length + 1).includes("/"))
        .sort()
        .filter((k) => !after || k > after)
        .filter((k) => filters.every(([f, op, v]) => (op === "array-contains" ? (store.get(k)[f] || []).includes(v) : store.get(k)[f] === v)))
        .slice(0, lim)
        .map((k) => ({ ref: docRef(k), data: () => store.get(k) }));
      return { empty: !docs.length, size: docs.length, docs };
    },
  });
  const db = {
    collection: (c) => colRef(c),
    batch: () => {
      const ops = [];
      return { delete: (r) => ops.push(() => r.delete()), update: (r, d) => ops.push(() => r.update(d)), commit: async () => { for (const o of ops) await o(); } };
    },
    recursiveDelete: async (r) => [...store.keys()].filter((k) => k === r.path || k.startsWith(r.path + "/")).forEach((k) => store.delete(k)),
  };
  const firestore = () => db;
  firestore.FieldValue = FieldValue;
  return { admin: { firestore, auth: () => ({ deleteUser: async (u) => deletedAuth.push(u) }) }, store, deletedAuth };
}

// ---- plan ----
assert.deepEqual(erasePlan("p", { classIds: ["c1", "c1"], pendingClassIds: ["c2"], teachesClassIds: ["c3"], parentUids: ["p", "x"], childUids: ["k1"] }),
  { memberOf: ["c1", "c2"], teaches: ["c3"], parents: ["x"], children: ["k1"] });

// ---- a parent with a profile child (made by the parent) and an own-login child; also a teacher ----
const seed = {
  "users/parent": { childUids: ["kidP", "kidL"], teachesClassIds: ["cT"], firstName: "Mohit" },
  "users/parent/questProgress/english": { nodes: {} },
  "users/kidP": { isChild: true, parentUids: ["parent"], classIds: ["cA"], firstName: "Ria" },
  "users/kidP/questProgress/english": { nodes: { a: 1 } },
  "users/kidL": { isChild: true, ownLogin: true, parentUids: ["parent"], firstName: "Pratha" },
  "users/other": { firstName: "Other" },
  "classes/cA": { teacherIds: ["t9"] },
  "classes/cA/members/kidP": { firstName: "Ria", parentName: "Mohit" },
  "classes/cA/members/other": { firstName: "Other" },
  "classes/cT": { teacherIds: ["parent", "t2"], teacherSubjects: { parent: ["English"], t2: ["Maths"] } },
  "classes/cT/teacherRequests/parent": { firstName: "Mohit" },
  "questAttempts/a1": { userId: "kidP", answers: [1] },
  "questAttempts/a2": { userId: "other", answers: [1] },
  "questAttempts/a3": { userId: "parent", answers: [1] },
  "consents/c1": { kind: "child-account", kidUid: "kidP", parentUid: "parent", parentName: "Mohit", version: "v1" },
  "consents/c2": { kind: "join-class", kidUid: "other", parentName: "Someone" },
  "userFeedback/f1": { userId: "kidP", userName: "Ria", feedbackText: "typo in Q3" },
  "parentPins/parent": { hash: "x" },
  "childLoginCodes/123456": { kidUid: "kidP", parentUid: "parent" },
  "parentLinkCodes/654321": { parentUid: "parent" },
  "childLoginCodes/777777": { kidUid: "kidP", parentUid: "someoneElse" }, // G42 finding 1: matched by kidUid
  "users/parent/x": {},
  "classes/cP": { teacherIds: ["t5"] }, // G42 finding 3: a request never approved
  "classes/cP/teacherRequests/parent": { firstName: "Mohit" },
  "classes/cA/cache/board": { rows: ["Ria"] }, // G42 finding 5
  "leaderboardCache/top10": { rows: ["Ria"] },
  "schools/s1": { admins: ["parent", "a2"] }, // G42 finding 4
};
for (let i = 0; i < 450; i++) seed[`consents/many${String(i).padStart(3, "0")}`] = { kind: "join-class", parentUid: "parent", parentName: "Mohit" }; // G42 finding 6
seed["users/parent"].pendingTeachClassIds = ["cP"];
const { admin, store, deletedAuth } = makeAdmin(structuredClone(seed));
const res = await eraseUser(admin, "parent");
const has = (p) => store.has(p);

assert.ok(!has("users/parent") && !has("users/parent/questProgress/english"), "parent doc + subcollections gone");
assert.ok(!has("users/kidP") && !has("users/kidP/questProgress/english"), "profile child erased with the parent");
assert.ok(has("users/kidL"), "own-login child kept");
assert.deepEqual(store.get("users/kidL").parentUids, [], "own-login child unlinked");
assert.ok(!has("classes/cA/members/kidP") && has("classes/cA/members/other"), "only their class membership goes");
assert.deepEqual(store.get("classes/cT").teacherIds, ["t2"], "removed as teacher");
assert.deepEqual(store.get("classes/cT").teacherSubjects, { t2: ["Maths"] });
assert.ok(!has("classes/cT/teacherRequests/parent"));
assert.ok(!has("questAttempts/a1") && !has("questAttempts/a3") && has("questAttempts/a2"), "only their answers go");
assert.equal(store.get("consents/c1").parentName, undefined, "consent kept without the parent's name");
assert.equal(store.get("consents/c1").kind, "child-account");
assert.equal(store.get("consents/c2").parentName, "Someone", "other families' consents untouched");
assert.equal(store.get("userFeedback/f1").userId, "deleted");
assert.equal(store.get("userFeedback/f1").userName, null);
assert.equal(store.get("userFeedback/f1").feedbackText, "typo in Q3", "report text kept for fixing the question");
assert.ok(!has("parentPins/parent") && !has("childLoginCodes/123456") && !has("parentLinkCodes/654321"));
assert.ok(has("users/other"), "other users untouched");
assert.ok(!has("childLoginCodes/777777"), "the child's login code goes even if another parent made it");
assert.ok(!has("classes/cP/teacherRequests/parent"), "a teacher request that was never approved goes");
assert.ok(!has("classes/cA/cache/board") && !has("leaderboardCache/top10"), "no name left in leaderboard caches");
assert.deepEqual(store.get("schools/s1").admins, ["a2"], "removed as school admin");
assert.ok([...store.keys()].filter((k) => k.startsWith("consents/many")).every((k) => store.get(k).parentName === undefined && store.get(k).kind), "all 450 consents lose the name, none deleted");
assert.deepEqual(deletedAuth.sort(), ["kidP", "parent"], "sign-in accounts deleted");
assert.equal(res.children, 1);

// ---- an own-login child deletes their own account: the parent is unlinked, the parent stays ----
const two = makeAdmin({ "users/p": { childUids: ["k"] }, "users/k": { ownLogin: true, parentUids: ["p"] } });
await eraseUser(two.admin, "k");
assert.deepEqual(two.store.get("users/p").childUids, [], "parent unlinked");
assert.ok(!two.store.has("users/k"));

// ---- a profile child shared by two parents is unlinked, not erased ----
const three = makeAdmin({ "users/p1": { childUids: ["k"] }, "users/p2": { childUids: ["k"] }, "users/k": { parentUids: ["p1", "p2"] } });
await eraseUser(three.admin, "p1");
assert.ok(three.store.has("users/k"));
assert.deepEqual(three.store.get("users/k").parentUids, ["p2"]);

console.log("eraseUser tests passed");
