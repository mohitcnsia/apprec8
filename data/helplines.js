// data/helplines.js — numbers on the "Need help?" sheet (mockup P2, owner OK 2026-11-05; Seema refines the words later).
// Checked by tests/helplines.test.mjs: change a number only after calling it yourself.
export const HELPLINES = [
  {
    id: "childline",
    name: "CHILDLINE",
    number: "1098",
    when: "If you feel unsafe or someone hurts you. Day and night.",
    call: true,
  },
  {
    id: "telemanas",
    name: "Tele MANAS",
    number: "14416",
    when: "If you feel very sad, worried or scared for a long time.",
    call: true,
  },
  {
    id: "emergency",
    name: "Emergency",
    number: "112",
    when: "If someone is in danger right now, shout for a grown-up. They can call 112.",
    call: false, // no call button for children (prank-call worry, owner 2026-11-04)
  },
];

export const HELP_TEXT = {
  title: "You're not alone",
  intro: "These people are kind and they help children every day. Calling is free.",
  callNote: "📞 Call opens your phone with the number ready; you press the green button. These lines are for real help: another child may be waiting.",
  tell: "Tell a grown-up you trust: Mummy, Papa, Dadi, a teacher. It's never your fault, and it's always OK to tell.",
  privacy: "Nothing you tap here is saved or shown to anyone.",
};
