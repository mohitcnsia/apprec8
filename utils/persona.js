// utils/persona.js: the owner's "View as" (owner, 2026-11-12: "I should be able to choose persona and should get changed
// view and permissions"). Pure: turns the owner's own user doc into what a kid of class N, a parent or a teacher has, so
// every screen that reads the user doc shows that person's view. Only what this phone shows changes: the owner's account
// keeps its owner rights on the server, and nothing is written to anyone.

export const ROLES = ["owner", "kid", "parent", "teacher"];
export const OWNER = { role: "owner", grade: null };

/** A valid persona or the owner. */
export function cleanPersona(p) {
  const role = ROLES.includes(p?.role) ? p.role : "owner";
  const grade = Number.isInteger(p?.grade) && p.grade >= 1 && p.grade <= 12 ? p.grade : null;
  if (role === "kid") return { role, grade: grade || 5 };
  return { role, grade: null };
}

/** The user doc as this persona would have it. */
export function applyPersona(data, persona) {
  const p = cleanPersona(persona);
  if (!data || p.role === "owner") return data;
  const { grade, ...rest } = data;
  if (p.role === "kid") return { ...rest, grade: p.grade, isChild: false, childUids: [], teachesClassIds: [] };
  if (p.role === "parent") return { ...rest, isChild: false, teachesClassIds: [] };
  return { ...rest, isChild: false, childUids: [] }; // teacher
}

export function personaLabel(persona) {
  const p = cleanPersona(persona);
  if (p.role === "kid") return `Kid · Class ${p.grade}`;
  return { owner: "Owner", parent: "Parent", teacher: "Teacher" }[p.role];
}
