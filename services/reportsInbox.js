// services/reportsInbox.js: the owner's Home → Needs you "N new reports from kids" (owner: "make sure I never miss bug
// reports"). Counts userFeedback (🚩 question reports, feedback, ideas) that arrived since the owner last opened
// Admin tools → Ideas & reports, and are not marked done. Reads only the new ones (createdAt after the last visit).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, query, where, orderBy, limit, getDocs, Timestamp } from "@react-native-firebase/firestore";

const KEY = "reportsSeenAt.v1";
const db = getFirestore();

/** Call when the owner opens the Ideas & reports list. */
export const markReportsSeen = () => AsyncStorage.setItem(KEY, String(Date.now())).catch(() => {});

/** New, open reports since the last visit (first time: the last 7 days). */
export async function newReportsCount() {
  const seen = Number(await AsyncStorage.getItem(KEY).catch(() => null)) || Date.now() - 7 * 864e5;
  const snap = await getDocs(query(collection(db, "userFeedback"), where("createdAt", ">", Timestamp.fromMillis(seen)), orderBy("createdAt", "desc"), limit(50)));
  return snap.docs.filter((d) => d.data().status !== "done").length;
}
