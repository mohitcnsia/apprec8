// utils/pilotOpen.js
// G90 (Seema's decision 6, 2026-11-10): all levels open for pilot kids. One admin-set flag on the class doc
// (`pilotUnlockAll: true`, Admin tools → the class). A kid in any such class sees every topic of their class open.
// Grade filtering stays (a Class 10 kid still sees Class 10 topics); only the path locks go.

/** classes: the kid's class docs. → true when any of them is a pilot class. */
export function isPilotOpen(classes = []) {
  return (classes || []).some((c) => c && c.pilotUnlockAll === true);
}
