// utils/dialogButtons.js: how the app popup (mockup T5) lays out buttons. Pure; same button format as Alert.alert:
// [{ text, onPress, style: "default" | "cancel" | "destructive" }].
// Rules (DESIGN_RULES: one loud thing, the safe choice is the big one):
//   - no buttons → one "OK"
//   - a destructive button exists → the safe (cancel / other) choice is big; destructive is a quiet red outline
//   - otherwise → the last non-cancel button is big; cancel is quiet
// Returned in display order: big first, then the others in their given order.

export function dialogLayout(buttons) {
  const list = Array.isArray(buttons) && buttons.length ? buttons.filter(Boolean) : [{ text: "OK" }];
  const items = list.map((b, i) => ({ text: String(b.text ?? "OK"), onPress: b.onPress, style: b.style || "default", i }));
  const hasDestructive = items.some((b) => b.style === "destructive");
  let big;
  if (hasDestructive) big = items.find((b) => b.style === "cancel") || items.find((b) => b.style !== "destructive");
  else big = [...items].reverse().find((b) => b.style !== "cancel") || items[items.length - 1];
  const rest = items.filter((b) => b !== big);
  return [...(big ? [{ ...big, role: "primary" }] : []), ...rest.map((b) => ({ ...b, role: b.style === "destructive" ? "danger" : "quiet" }))];
}

/** The button that Android back / a tap outside should press: the cancel one, or the only one. Else null (stay open). */
export function dismissButton(buttons) {
  const items = dialogLayout(buttons);
  return items.find((b) => b.style === "cancel") || (items.length === 1 ? items[0] : null);
}

/** Old ConfirmationModal callers: "Delete" / "Leave" / "Sign out" are destructive. */
export const looksDestructive = (text = "") => /\b(delete|remove|leave|sign out|log out|reset|quit|discard)\b/i.test(String(text));
