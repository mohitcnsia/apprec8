// utils/topicView.js: the teacher's topic view (instead of a heatmap; mockup in the redesign doc, owner OK 2026-11-11).
// One row per topic, worst first, from the class summary (classSummaries/{classId}). Pure, so it is tested.
//   Learned = learned + still remembers · Practising · New (no answers yet, including kids with no entry) · Slipping.

const GROUP = { l: "learned", r: "learned", p: "practising", s: "slipping", n: "new" };

/**
 * @param {object} summary - classSummaries doc data ({ kids: { [uid]: { name, [questId]: { lv } } } })
 * @param {Array} members - [{ uid, firstName }] approved kids now in the class (removed kids are left out)
 * @param {string[]} questIds - the teacher's quests for this class
 * @param {(questId) => (topic) => string} namerFor - topic titles per quest
 * @returns [{ key, questId, topic, title, total, learned, practising, newCount, slipping, names: { learned, practising, new, slipping } }]
 */
export function topicRows(summary, members = [], questIds = [], namerFor = () => (t) => t) {
  const kids = summary?.kids || {};
  const rows = [];
  questIds.forEach((questId) => {
    const topics = new Set();
    members.forEach((m) => Object.keys(kids[m.uid]?.[questId]?.lv || {}).forEach((t) => topics.add(t)));
    const namer = namerFor(questId);
    topics.forEach((topic) => {
      const names = { learned: [], practising: [], new: [], slipping: [] };
      members.forEach((m) => {
        const code = kids[m.uid]?.[questId]?.lv?.[topic] || "n";
        names[GROUP[code] || "new"].push(m.firstName || kids[m.uid]?.name || "Kid");
      });
      Object.values(names).forEach((list) => list.sort((a, b) => a.localeCompare(b)));
      rows.push({
        key: `${questId}|${topic}`,
        questId,
        topic,
        title: namer(topic),
        total: members.length,
        learned: names.learned.length,
        practising: names.practising.length,
        newCount: names.new.length,
        slipping: names.slipping.length,
        names,
      });
    });
  });
  // Worst first: the smallest share learned; ties → more slipping first.
  return rows.sort((a, b) => a.learned / (a.total || 1) - b.learned / (b.total || 1) || b.slipping - a.slipping || a.title.localeCompare(b.title));
}

/** "4 learned · 12 practising · 13 new · 3 slipping" */
export const rowLine = (r) => `${r.learned} learned · ${r.practising} practising · ${r.newCount} new · ${r.slipping} slipping`;

/** The card's title line: the worst topic, said plainly. */
export function headline(rows = []) {
  const w = rows[0];
  if (!w) return null;
  return `${w.title} needs you most: ${w.learned} of ${w.total} have learned it`;
}
