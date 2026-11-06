// utils/nextStep.js
// Pure functions for resolving and launching the next step in a quest (G49).
// Follows EnglishQuestMapScreen logic: finds the active glowing step on the quest path.

import {
  buildQuestPath,
  DEFAULT_PRACTICE_PASS_PERCENT,
  DEFAULT_GATE_PASS_PERCENT,
  DEFAULT_BOSS_PASS_PERCENT,
} from "./questTree.js";
import { topicSlug } from "./kidStats.js";
import { bundledQuest } from "../data/quests/index.js";

/**
 * Resolves the next playable step for a quest given its nodes and user progress.
 * Matches the step that EnglishQuestMapScreen would highlight/glow.
 *
 * @param {Array<object>} nodes - Quest nodes list
 * @param {object} progressNodes - Progress nodes map ({ [stepId]: { status, bestPercent, ... } })
 * @param {object} [options] - { extraUnlocked, unlockAll }
 * @returns {object|null} Next step details
 */
export function findNextStep(nodes = [], progressNodes = {}, { extraUnlocked = [], unlockAll = false } = {}) {
  if (!Array.isArray(nodes) || nodes.length === 0) return null;

  const tree = buildQuestPath(nodes, progressNodes, { extraUnlocked, unlockAll });
  if (!tree || !Array.isArray(tree.path) || tree.path.length === 0) return null;

  // 1. Check if any gate is retryLocked and requires a glowing practice leaf
  for (const item of tree.path) {
    if (item.kind === "main" && item.gate?.retryLocked) {
      const glowingLeaf = (item.practices || []).find((p) => p.glow && p.status !== "locked" && p.status !== "comingSoon");
      if (glowingLeaf && glowingLeaf.nextStep) {
        return {
          targetType: "practice",
          node: glowingLeaf,
          step: glowingLeaf.nextStep,
          title: glowingLeaf.title,
          displayTitle: glowingLeaf.subtopic || glowingLeaf.title,
          passPercent: glowingLeaf.passPercent ?? DEFAULT_PRACTICE_PASS_PERCENT,
          extraContext: {
            activity: "practice",
            branchId: item.branchId || null,
            unitId: item.unitId || null,
            topicTag: glowingLeaf.subtopic || topicSlug(item.title),
            resetGateId: item.gate.id,
          },
        };
      }
    }
  }

  // 2. Look at the current active path item
  const currentItem = tree.path.find((p) => p.id === tree.currentPathId) || tree.path[0];
  if (!currentItem) return null;

  // Case A: Boss node
  if (currentItem.kind === "boss") {
    return {
      targetType: "boss",
      node: currentItem,
      step: { id: currentItem.id, type: "quiz", quizId: currentItem.quizId },
      title: currentItem.title,
      displayTitle: currentItem.title,
      passPercent: currentItem.passPercent ?? DEFAULT_BOSS_PASS_PERCENT,
      extraContext: {
        activity: "boss",
        unitId: currentItem.unitId || null,
        topicTag: topicSlug(currentItem.title),
      },
    };
  }

  // Case B: Main topic node
  if (currentItem.kind === "main") {
    // If main node is unlocked (in progress or not started): nextStep is its step
    if (currentItem.status === "unlocked" && currentItem.nextStep) {
      return {
        targetType: "main",
        node: currentItem,
        step: currentItem.nextStep,
        title: currentItem.title,
        displayTitle: currentItem.title,
        passPercent: DEFAULT_PRACTICE_PASS_PERCENT,
        extraContext: {
          activity: "practice",
          branchId: currentItem.branchId || null,
          unitId: currentItem.unitId || null,
          topicTag: currentItem.subtopic || topicSlug(currentItem.title),
        },
      };
    }

    // If main node is completed, check if gate is open
    if (currentItem.status === "completed") {
      if (currentItem.gate && currentItem.gate.status === "unlocked") {
        return {
          targetType: "gate",
          node: currentItem.gate,
          step: { id: currentItem.gate.id, type: "quiz", quizId: currentItem.gate.quizId },
          title: currentItem.gate.title,
          displayTitle: currentItem.gate.title || `${currentItem.title} Challenge`,
          passPercent: currentItem.gate.passPercent ?? DEFAULT_GATE_PASS_PERCENT,
          extraContext: {
            activity: "gate",
            branchId: currentItem.branchId || null,
            unitId: currentItem.unitId || null,
            topicTag: currentItem.subtopic || topicSlug(currentItem.title),
          },
        };
      }

      // Check if there are uncompleted practices
      const uncompletedPractice = (currentItem.practices || []).find((p) => p.status === "unlocked");
      if (uncompletedPractice && uncompletedPractice.nextStep) {
        return {
          targetType: "practice",
          node: uncompletedPractice,
          step: uncompletedPractice.nextStep,
          title: uncompletedPractice.title,
          displayTitle: uncompletedPractice.subtopic || uncompletedPractice.title,
          passPercent: uncompletedPractice.passPercent ?? DEFAULT_PRACTICE_PASS_PERCENT,
          extraContext: {
            activity: "practice",
            branchId: currentItem.branchId || null,
            unitId: currentItem.unitId || null,
            topicTag: uncompletedPractice.subtopic || topicSlug(currentItem.title),
          },
        };
      }
    }
  }

  // Fallback: look for the first unlocked node on path
  const anyUnlocked = tree.path.find((p) => p.status === "unlocked");
  if (anyUnlocked && anyUnlocked.nextStep) {
    return {
      targetType: anyUnlocked.kind || "main",
      node: anyUnlocked,
      step: anyUnlocked.nextStep,
      title: anyUnlocked.title,
      displayTitle: anyUnlocked.title,
      passPercent: DEFAULT_PRACTICE_PASS_PERCENT,
      extraContext: {
        activity: "practice",
        branchId: anyUnlocked.branchId || null,
        unitId: anyUnlocked.unitId || null,
        topicTag: anyUnlocked.subtopic || topicSlug(anyUnlocked.title),
      },
    };
  }

  // All completed: replay practice on current/last item
  if (currentItem && currentItem.nextStep) {
    return {
      targetType: currentItem.kind || "main",
      node: currentItem,
      step: currentItem.nextStep,
      title: currentItem.title,
      displayTitle: currentItem.title,
      passPercent: DEFAULT_PRACTICE_PASS_PERCENT,
      isReplay: true,
      extraContext: {
        activity: "practice",
        branchId: currentItem.branchId || null,
        unitId: currentItem.unitId || null,
        topicTag: currentItem.subtopic || topicSlug(currentItem.title),
      },
    };
  }

  return null;
}

/**
 * Returns human-readable "Up next: <title>" label for a quest.
 */
export function getNextStepTitle(nextStepResult) {
  if (!nextStepResult) return "Start here";
  return nextStepResult.displayTitle || nextStepResult.title || "Next topic";
}

/**
 * Navigates to the next step directly from HomeScreen.
 * Follows EnglishQuestMapScreen.openStep navigation patterns.
 */
export function openNextStep(navigation, questId, nextStepResult, options = {}) {
  if (!navigation || !questId || !nextStepResult) return false;
  const { node, step, passPercent = DEFAULT_PRACTICE_PASS_PERCENT, extraContext = {} } = nextStepResult;

  const questContext = {
    questId,
    nodeId: step.id,
    passPercent,
    returnTo: options.returnTo || "Home",
    knownIssues: options.knownIssues || {},
    contentVersion: options.contentVersion ?? null,
    activity: extraContext.activity || "practice",
    branchId: node.branchId || null,
    unitId: node.unitId || null,
    topicTag: extraContext.topicTag || node.subtopic || topicSlug(node.title),
    ...extraContext,
  };

  if (step.type === "study") {
    const steps = node.steps || [];
    const after = steps[steps.findIndex((x) => x.id === step.id) + 1];
    let nextStepInfo = null;
    try {
      const bundled = bundledQuest(questId);
      nextStepInfo = after && after.type === "quiz" ? { id: after.id, count: bundled?.quizzes?.[after.quizId]?.length ?? null } : null;
    } catch (e) {
      nextStepInfo = null;
    }
    navigation.navigate("Apprec8Reader", {
      contentId: step.contentId,
      questContext: { ...questContext, nextStep: nextStepInfo },
    });
    return true;
  }

  if (step.type === "reading") {
    navigation.navigate("ReadingScreen", {
      contentId: step.contentId,
      questContext,
    });
    return true;
  }

  if (step.type === "quiz") {
    navigation.navigate("QuizDetails", {
      quiz: {
        id: step.quizId,
        title: node.title,
        description: node.story
          ? `${node.story}\n\nScore ${passPercent}% or more to win and open the next unit.`
          : `Score ${passPercent}% or more to complete this step. Choose Training to practise with hints, or Exam to test yourself.`,
        config: {
          shuffleQuestions: true,
          shuffleOptions: true,
          questionCount: 10,
          excludeIds: options.hiddenIds || [],
          contentVersion: options.contentVersion ?? null,
          ...(options.config || {}),
        },
      },
      questContext,
    });
    return true;
  }

  return false;
}
