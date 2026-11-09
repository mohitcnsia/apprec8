// tests/courseVisibility.test.mjs
// Tests for utils/courseVisibility.js (G81). Run: npm test
import assert from "node:assert/strict";
import {
  isTileVisible,
  filterVisibleTiles,
  isEnrolledCourse,
  orderQuestsForHome,
  ADMIN_UID,
} from "../utils/courseVisibility.js";
import * as seemaClass10 from "../data/teacherCourses/seemaClass10.js";
import { QUESTS } from "../data/quests/index.js";
import { questsForTeacher } from "../utils/classes.js";
import { nodesForGrade } from "../utils/gradeFilter.js";

// --- Sample test data ---
const publicTile = {
  id: "english-quest",
  title: "English Quest",
  forClassIds: null,
};

const restrictedCourseTile = {
  id: "course-seema-c10-english",
  title: "Seema Ma'am · Class 10 English",
  forClassIds: ["demo_class_10b"],
};

const bundledModule = {
  QUEST_ID: "course-seema-c10-english",
  quest: {
    id: "course-seema-c10-english",
    forClassIds: ["demo_class_10b"],
  },
  tile: {
    id: "course-seema-c10-english",
    forClassIds: ["demo_class_10b"],
  },
};

const studentInClass = {
  uid: "student_10b",
  classIds: ["demo_class_10b"],
};

const studentOutsideClass = {
  uid: "student_5a",
  classIds: ["demo_class_5a"],
};

const studentNoClasses = {
  uid: "student_solo",
  classIds: [],
};

const teacherOfClass = {
  uid: "teacher_seema",
  teachesClassIds: ["demo_class_10b"],
};

const teacherOtherClass = {
  uid: "teacher_other",
  teachesClassIds: ["demo_class_5a"],
};

const adminUser = {
  uid: ADMIN_UID,
  classIds: [],
};

const customAdminUser = {
  uid: "custom_admin",
  isAdmin: true,
};

// 1. Public tiles visible to all
assert.equal(isTileVisible(publicTile, null), true, "public tile visible to anonymous");
assert.equal(isTileVisible(publicTile, studentNoClasses), true, "public tile visible to student");
assert.equal(isTileVisible(publicTile, teacherOfClass), true, "public tile visible to teacher");
assert.equal(isTileVisible(publicTile, adminUser), true, "public tile visible to admin");

// 2. Restricted tiles visibility
assert.equal(isTileVisible(restrictedCourseTile, null), false, "restricted tile hidden from anonymous");
assert.equal(isTileVisible(restrictedCourseTile, studentNoClasses), false, "restricted tile hidden from unassigned student");
assert.equal(isTileVisible(restrictedCourseTile, studentOutsideClass), false, "restricted tile hidden from outside student");
assert.equal(isTileVisible(restrictedCourseTile, studentInClass), true, "restricted tile visible to enrolled student");
assert.equal(isTileVisible(restrictedCourseTile, teacherOtherClass), false, "restricted tile hidden from other teacher");
assert.equal(isTileVisible(restrictedCourseTile, teacherOfClass), true, "restricted tile visible to class teacher");
assert.equal(isTileVisible(restrictedCourseTile, adminUser), true, "restricted tile visible to admin UID");
assert.equal(isTileVisible(restrictedCourseTile, customAdminUser), true, "restricted tile visible to isAdmin flag");
assert.equal(isTileVisible(restrictedCourseTile, studentOutsideClass, { isAdmin: true }), true, "restricted tile visible with isAdmin option");

// 3. Bundled module shape support
assert.equal(isTileVisible(bundledModule, studentInClass), true, "bundled module visible to enrolled student");
assert.equal(isTileVisible(bundledModule, studentOutsideClass), false, "bundled module hidden from outside student");

// 4. filterVisibleTiles
const allTiles = [publicTile, restrictedCourseTile];
assert.deepEqual(
  filterVisibleTiles(allTiles, studentOutsideClass).map((t) => t.id),
  ["english-quest"],
  "outside student only sees public tile"
);
assert.deepEqual(
  filterVisibleTiles(allTiles, studentInClass).map((t) => t.id),
  ["english-quest", "course-seema-c10-english"],
  "enrolled student sees both tiles"
);
assert.deepEqual(
  filterVisibleTiles(allTiles, teacherOfClass).map((t) => t.id),
  ["english-quest", "course-seema-c10-english"],
  "teacher of class sees both tiles"
);
assert.deepEqual(
  filterVisibleTiles(allTiles, null).map((t) => t.id),
  ["english-quest"],
  "logged-out user only sees public tile"
);

// 5. isEnrolledCourse & orderQuestsForHome
assert.equal(isEnrolledCourse(publicTile, studentInClass), false);
assert.equal(isEnrolledCourse(restrictedCourseTile, studentInClass), true);
assert.equal(isEnrolledCourse(restrictedCourseTile, studentOutsideClass), false);
assert.equal(isEnrolledCourse(restrictedCourseTile, teacherOfClass), false, "teacher is not enrolled student");

const tilesForHome = [
  { id: "english-quest", title: "English" },
  { id: "course-seema-c10-english", title: "Seema Class 10", forClassIds: ["demo_class_10b"] },
  { id: "science-quest", title: "Science" },
];

// For enrolled student: course tile comes first
const orderedForEnrolled = orderQuestsForHome(tilesForHome, studentInClass);
assert.deepEqual(
  orderedForEnrolled.map((t) => t.id),
  ["course-seema-c10-english", "english-quest", "science-quest"],
  "enrolled student gets course tile first on Home"
);

// For outside student: order unchanged
const orderedForOutside = orderQuestsForHome(tilesForHome, studentOutsideClass);
assert.deepEqual(
  orderedForOutside.map((t) => t.id),
  ["english-quest", "course-seema-c10-english", "science-quest"],
  "outside student retains original order"
);

// Edge cases
assert.deepEqual(orderQuestsForHome([], studentInClass), []);
assert.deepEqual(orderQuestsForHome([publicTile], studentInClass), [publicTile]);

// 6. End-to-End Integration with bundled Seema Course (G81 Clean Test RULE)
assert.equal(seemaClass10.QUEST_ID, "course-seema-c10-english");
assert.equal(seemaClass10.nodes.length, 84, "Grammar Pro b1-b6 (84 nodes)");
assert.ok(seemaClass10.FOR_CLASS_IDS.includes("demo_class_10b"), "FOR_CLASS_IDS includes demo_class_10b");

// A Demo School student in class 10-B sees it first on Home
const student10b = { uid: "demo_student_10b", classIds: ["demo_class_10b"], grade: 10 };
const visibleFor10b = filterVisibleTiles(QUESTS.map((m) => m.tile), student10b);
const homeTiles10b = orderQuestsForHome(visibleFor10b, student10b);
assert.equal(homeTiles10b[0].questId || homeTiles10b[0].id, "course-seema-c10-english", "Demo School 10-B student sees Seema course first on Home");
assert.ok(homeTiles10b.some((t) => (t.questId || t.id) === "english-quest"), "English Quest is still accessible");

// A student outside the class (e.g. 5-A) does NOT see it anywhere
const student5a = { uid: "demo_student_5a", classIds: ["demo_class_5a"], grade: 5 };
const visibleFor5a = filterVisibleTiles(QUESTS.map((m) => m.tile), student5a);
assert.ok(!visibleFor5a.some((t) => t.id === "course-seema-c10-english"), "Student in 5-A cannot see Seema course on Home");
assert.equal(isTileVisible(seemaClass10.quest, student5a), false, "Hidden in Progress for student in 5-A");

// Parent week card filter
const parentMine10b = QUESTS.filter((m) => !m.quest?.draft && isTileVisible(m.quest, student10b) && nodesForGrade(m.nodes, student10b.grade).some((n) => n.kind === "main"));
assert.ok(parentMine10b.some((m) => m.QUEST_ID === "course-seema-c10-english"), "Parent of 10-B student sees course in ParentWeekCard");
const parentMine5a = QUESTS.filter((m) => !m.quest?.draft && isTileVisible(m.quest, student5a) && nodesForGrade(m.nodes, student5a.grade).some((n) => n.kind === "main"));
assert.ok(!parentMine5a.some((m) => m.QUEST_ID === "course-seema-c10-english"), "Parent of 5-A student does not see course in ParentWeekCard");

// Teacher of Class 10-B can assign from it
const cls10bTeacher = { id: "demo_class_10b", name: "10-B", teacherSubjects: { seemaTeacher: ["english"] } };
const teacherQuests10b = questsForTeacher(cls10bTeacher, "seemaTeacher");
assert.ok(teacherQuests10b.includes("course-seema-c10-english"), "10-B English teacher can assign from Seema course");

// Teacher of Class 5-A cannot assign from it
const cls5aTeacher = { id: "demo_class_5a", name: "5-A", teacherSubjects: { otherTeacher: ["english"] } };
const teacherQuests5a = questsForTeacher(cls5aTeacher, "otherTeacher");
assert.ok(!teacherQuests5a.includes("course-seema-c10-english"), "5-A English teacher cannot assign from Seema course");

console.log("courseVisibility tests passed");
