// utils/localProgress.js
// Offline & learn-first progress storage on the phone (AsyncStorage).
// Spec: CODE_REVIEW.md "learn first + parent web link" (mockup row X6–X9, owner-approved 2026-11-06).
// For unconsented children (DPDP Act): keep all learning activity on the device until parental consent.
// Pure storage logic, testable with any Map-like or AsyncStorage adapter.

import { scoreAnswers } from "./questTree.js";
import { mistakeUpdates, MAX_MISTAKES } from "./mistakes.js";
import { updateStats } from "./kidStats.js";

export const LOCAL_PREFIX = "@apprec8:local";

export const localProgressKey = (uid, questId) => `${LOCAL_PREFIX}_progress:${uid}:${questId}`;
export const localAttemptsKey = (uid) => `${LOCAL_PREFIX}_attempts:${uid}`;
export const localStarsKey = (uid) => `${LOCAL_PREFIX}_stars:${uid}`;

/** Safe JSON parse fallback */
function parseJson(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Loads local quest progress for a kid.
 * Returns { questId, nodes, mistakes, stats, updatedAt }
 */
export async function loadLocalProgress(storage, uid, questId) {
  if (!storage || !uid || !questId) return { questId, nodes: {}, mistakes: {}, stats: {}, updatedAt: null };
  const key = localProgressKey(uid, questId);
  const raw = await storage.getItem(key);
  const data = parseJson(raw, {});
  return {
    questId,
    nodes: data.nodes || {},
    mistakes: data.mistakes || {},
    stats: data.stats || {},
    updatedAt: data.updatedAt || null,
  };
}

/**
 * Saves or updates one node in the kid's local progress.
 */
export async function saveLocalNodeProgress(
  storage,
  uid,
  questId,
  nodeId,
  { percent = 0, passed = false, gate = null, resetGateId = null, now = Date.now() } = {}
) {
  if (!storage || !uid || !questId || !nodeId) return null;
  const current = await loadLocalProgress(storage, uid, questId);
  const previous = current.nodes[nodeId] || {};
  const previousBest = typeof previous.bestPercent === "number" ? previous.bestPercent : 0;
  const attempts = (previous.attempts || 0) + 1;
  const alreadyCompleted = previous.status === "completed";

  const nodeUpdate = {
    ...previous,
    attempts,
    bestPercent: Math.max(previousBest, percent),
    lastPlayedAt: now,
  };

  if (passed || alreadyCompleted) {
    nodeUpdate.status = "completed";
  }
  if (passed && !alreadyCompleted) {
    nodeUpdate.completedAt = now;
  }

  // Gate fails and weak subtopics
  if (gate) {
    if (passed || alreadyCompleted) {
      nodeUpdate.failsSinceLastPractice = 0;
      nodeUpdate.weakSubtopics = [];
    } else {
      nodeUpdate.failsSinceLastPractice = (previous.failsSinceLastPractice || 0) + 1;
      nodeUpdate.weakSubtopics = gate.weak || [];
    }
  }

  const updatedNodes = {
    ...current.nodes,
    [nodeId]: nodeUpdate,
  };

  if (resetGateId && passed && resetGateId !== nodeId && updatedNodes[resetGateId]) {
    updatedNodes[resetGateId] = {
      ...updatedNodes[resetGateId],
      failsSinceLastPractice: 0,
    };
  }

  const payload = {
    ...current,
    questId,
    nodes: updatedNodes,
    updatedAt: now,
  };

  await storage.setItem(localProgressKey(uid, questId), JSON.stringify(payload));
  return payload;
}

/**
 * Calculates stars earned for an attempt score.
 * 3 stars for 90%+, 2 for 60%+, 1 for any correct score (>0%).
 */
export function calculateAttemptStars(percent, passed) {
  if (!passed) return 0;
  if (percent >= 90) return 3;
  if (percent >= 60) return 2;
  if (percent > 0) return 1;
  return 0;
}

/**
 * Saves one quiz attempt locally:
 * - Appends to local attempts list
 * - Updates local mistakes
 * - Updates local stats
 * - Updates node progress (unless skipProgress is true)
 * - Updates local stars
 */
export async function saveLocalAttempt(storage, uid, p, { now = Date.now() } = {}) {
  if (!storage || !uid || !p) return null;
  const scored = scoreAnswers(p.answers || [], p.totalQuestions || (p.answers || []).length);
  const gate = p.gateResult || null;
  const correctCount = gate ? gate.correctCount : scored.correctCount;
  const total = gate ? gate.total : scored.total;
  const percent = gate ? gate.percent : scored.percent;
  const passed = p.outcome === "finished" && (gate ? gate.passed : percent >= (p.passPercent || 80));
  const startedAt = p.startedAt || now;
  const durationMs = startedAt ? now - startedAt : 0;

  // 1. Append attempt record
  const attemptRecord = {
    id: `local_${now}_${Math.random().toString(36).slice(2, 8)}`,
    userId: uid,
    userName: p.userName || null,
    questId: p.questId,
    nodeId: p.nodeId,
    quizId: p.quizId,
    mode: p.mode || "training",
    outcome: p.outcome || "finished",
    totalQuestions: total,
    answeredCount: (p.answers || []).length,
    correctCount,
    percent,
    passPercent: p.passPercent || 80,
    passed,
    startedAtMs: startedAt,
    durationMs,
    answers: (p.answers || []).map((a) =>
      Object.fromEntries(Object.entries(a).filter(([, v]) => v !== undefined))
    ),
    details: gate
      ? { ...(p.details || {}), gate: { bySubtopic: gate.bySubtopic, weak: gate.weak } }
      : p.details || null,
    createdAt: now,
  };

  const attemptsKey = localAttemptsKey(uid);
  const existingAttemptsRaw = await storage.getItem(attemptsKey);
  const existingAttempts = parseJson(existingAttemptsRaw, []);
  existingAttempts.push(attemptRecord);
  await storage.setItem(attemptsKey, JSON.stringify(existingAttempts));

  // 2. Load current progress to update mistakes and stats
  const progress = await loadLocalProgress(storage, uid, p.questId);

  // 3. Update mistakes
  const mUpdates = mistakeUpdates(progress.mistakes, p.answers || [], {
    mode: p.activity || "practice",
    quizId: p.quizId,
    branchId: p.branchId || null,
    unitId: p.unitId || null,
    now,
  });

  const updatedMistakes = { ...progress.mistakes };
  for (const [k, v] of Object.entries(mUpdates)) {
    if (v === null) {
      delete updatedMistakes[k];
    } else {
      updatedMistakes[k] = v;
    }
  }

  // Cap mistakes count
  const mistakeKeys = Object.keys(updatedMistakes);
  if (mistakeKeys.length > MAX_MISTAKES) {
    const sorted = mistakeKeys.sort(
      (a, b) => (updatedMistakes[a].lastWrongAt || 0) - (updatedMistakes[b].lastWrongAt || 0)
    );
    const drop = sorted.slice(0, mistakeKeys.length - MAX_MISTAKES);
    for (const k of drop) delete updatedMistakes[k];
  }

  // 4. Update stats
  const updatedStats = updateStats(progress.stats, p.answers || [], {
    now,
    durationMs,
    questId: p.questId,
    userName: p.userName || null,
    topicFallback: p.topicTag || null,
  });

  // 5. Update node progress if not skipped
  let updatedNodes = progress.nodes;
  if (!p.skipProgress) {
    const prevNode = updatedNodes[p.nodeId] || {};
    const prevBest = typeof prevNode.bestPercent === "number" ? prevNode.bestPercent : 0;
    const nodeCompleted = prevNode.status === "completed" || passed;

    const nodeUpdate = {
      ...prevNode,
      attempts: (prevNode.attempts || 0) + 1,
      bestPercent: Math.max(prevBest, percent),
      lastPlayedAt: now,
      status: nodeCompleted ? "completed" : prevNode.status || "unlocked",
    };
    if (passed && prevNode.status !== "completed") {
      nodeUpdate.completedAt = now;
    }
    if (gate) {
      if (passed || prevNode.status === "completed") {
        nodeUpdate.failsSinceLastPractice = 0;
        nodeUpdate.weakSubtopics = [];
      } else {
        nodeUpdate.failsSinceLastPractice = (prevNode.failsSinceLastPractice || 0) + 1;
        nodeUpdate.weakSubtopics = gate.weak || [];
      }
    }
    updatedNodes = { ...updatedNodes, [p.nodeId]: nodeUpdate };
    if (p.resetGateId && passed && p.resetGateId !== p.nodeId && updatedNodes[p.resetGateId]) {
      updatedNodes[p.resetGateId] = { ...updatedNodes[p.resetGateId], failsSinceLastPractice: 0 };
    }
  }

  // Save merged progress
  const updatedProgress = {
    ...progress,
    nodes: updatedNodes,
    mistakes: updatedMistakes,
    stats: updatedStats,
    updatedAt: now,
  };
  await storage.setItem(localProgressKey(uid, p.questId), JSON.stringify(updatedProgress));

  // 6. Stars count
  const starsAwarded = calculateAttemptStars(percent, passed);
  if (starsAwarded > 0) {
    await addLocalStars(storage, uid, starsAwarded);
  }

  return { percent, passed, starsAwarded };
}

/** Get total stars earned on this phone */
export async function getLocalStars(storage, uid) {
  if (!storage || !uid) return 0;
  const raw = await storage.getItem(localStarsKey(uid));
  return Number(raw) || 0;
}

/** Add stars to local total */
export async function addLocalStars(storage, uid, count) {
  if (!storage || !uid || !count) return;
  const current = await getLocalStars(storage, uid);
  const next = Math.max(0, current + Number(count));
  await storage.setItem(localStarsKey(uid), String(next));
  return next;
}

/**
 * Prepares all local data for upload when parent gives consent.
 * Returns { progressDocs: [{ questId, data }], attempts: [...] }
 */
export async function prepareLocalProgressUpload(storage, uid, questIds = ["english-quest", "science-quest", "word-bank"]) {
  if (!storage || !uid) return { progressDocs: [], attempts: [] };
  const progressDocs = [];
  for (const qId of questIds) {
    const raw = await storage.getItem(localProgressKey(uid, qId));
    if (raw) {
      const data = parseJson(raw, null);
      if (data && Object.keys(data.nodes || {}).length > 0) {
        progressDocs.push({ questId: qId, data });
      }
    }
  }

  const rawAttempts = await storage.getItem(localAttemptsKey(uid));
  const attempts = parseJson(rawAttempts, []);

  return { progressDocs, attempts };
}

/**
 * Clears local progress after successful server upload.
 */
export async function clearLocalProgress(storage, uid, questIds = ["english-quest", "science-quest", "word-bank"]) {
  if (!storage || !uid) return;
  for (const qId of questIds) {
    await storage.removeItem(localProgressKey(uid, qId));
  }
  await storage.removeItem(localAttemptsKey(uid));
  await storage.removeItem(localStarsKey(uid));
}
