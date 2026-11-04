// utils/reminders.js
// Kids' reminders = their own tasks (Home + tabs redesign, 2026-11-04). Owner rule: up to 5 active
// (not completed) reminders per kid. The admin uses tasks for team work and has no limit.

export const MAX_REMINDERS = 5;

export const activeReminders = (tasks = [], uid) =>
  tasks.filter((t) => t && t.userId === uid && !t.completed).length;

export const canAddReminder = (tasks = [], uid, { isAdmin = false } = {}) =>
  isAdmin || activeReminders(tasks, uid) < MAX_REMINDERS;

export const LIMIT_MESSAGE = `You can have ${MAX_REMINDERS} reminders at a time. Tick one off or delete one first.`;
