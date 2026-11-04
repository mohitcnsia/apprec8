// services/familyApi.js
// RB-6 parent-first accounts: thin wrappers around functions/callable/familyActions.js.
import functions from "@react-native-firebase/functions";
import { signInWithCustomToken } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { authInstance } from "../config/firebaseConfig";
import { childPayload, normalizeChildCode } from "../utils/family";

const db = getFirestore(getApp());
const call = (name, data) => functions().httpsCallable(name)(data).then((r) => r.data);

/** Parent adds a child → { kidUid, code, hours }. */
export const addChild = (form) => call("createChildProfile", childPayload(form));
export const newChildCode = (kidUid) => call("newChildLoginCode", { kidUid });
export const deleteChild = (kidUid) => call("deleteChildProfile", { kidUid });

/** The parent's children (names + class) from their user docs (rules: parents read their children's docs, DR-10). */
export async function myChildren(childUids = []) {
  const out = [];
  for (const uid of childUids) {
    try {
      const d = await getDoc(doc(db, "users", uid));
      if (d.exists()) out.push({ uid, firstName: d.data().firstName, grade: d.data().grade });
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
