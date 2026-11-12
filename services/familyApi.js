// services/familyApi.js
// RB-6 parent-first accounts: thin wrappers around functions/callable/familyActions.js.
import functions from "@react-native-firebase/functions";
import { signInWithCustomToken } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { authInstance } from "../config/firebaseConfig";
import { childPayload, normalizeChildCode } from "../utils/family";
import { endSession } from "./playSession";

const db = getFirestore(getApp());
const call = (name, data) => functions().httpsCallable(name)(data).then((r) => r.data);

/** Parent adds a child → { kidUid, code, hours }. */
export const addChild = (form) => call("createChildProfile", childPayload(form));
export const newChildCode = (kidUid) => call("newChildLoginCode", { kidUid });
export const deleteChild = (kidUid) => call("deleteChildProfile", { kidUid });
/** Link a child's existing account (decision 9): parent makes a code → { code, hours }; the child redeems it. */
export const createParentLinkCode = ({ parentName, relation, language, version }) => call("createParentLinkCode", { consent: { parentName, relation, language, version } });
export const redeemParentLinkCode = (code) => call("redeemParentLinkCode", { code });

/** The parent's children (names + class) from their user docs (rules: parents read their children's docs, DR-10). */
export async function myChildren(childUids = []) {
  const out = [];
  for (const uid of childUids) {
    try {
      const d = await getDoc(doc(db, "users", uid));
      // waitingForTeacher: the sign-up doc's "waiting for the teacher" under My children (asked to join, not approved yet).
      if (d.exists()) out.push({ uid, firstName: d.data().firstName, grade: d.data().grade, ownLogin: !!d.data().ownLogin, waitingForTeacher: (d.data().pendingClassIds || []).length > 0, classIds: d.data().classIds || [], pendingClassIds: d.data().pendingClassIds || [] });
    } catch (e) {
      out.push({ uid, firstName: "Child", grade: null });
    }
  }
  return out;
}

/** On the child's phone: code from the parent → signed in as the child. */
export async function signInWithChildCode(input) {
  const code = normalizeChildCode(input);
  if (!code) throw new Error("The code has 6 letters and numbers.");
  const { token } = await call("redeemChildLoginCode", { code });
  await signInWithCustomToken(authInstance, token);
}

// ---------- One phone, several profiles ----------
export const setParentPin = (pin) => call("setParentPin", { pin });

/** Parent's phone: "Play as <child>" → this phone is now signed in as the child. */
export async function playAsChild(kidUid) {
  const { token } = await call("switchToChild", { kidUid });
  await signInWithCustomToken(authInstance, token);
}

/** Child's session: back to the parent with the parent's PIN. */
export async function backToParent(pin) {
  const { token } = await call("switchToParent", { pin });
  await signInWithCustomToken(authInstance, token);
  await endSession(); // unpin the phone and stop the timer (mockup N1)
}
