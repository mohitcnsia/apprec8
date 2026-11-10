// services/joinApi.js: sign-up without codes (stage 1): thin wrappers around functions/callable/joinActions.js.
import functions from "@react-native-firebase/functions";
import { JOIN_LINK_BASE } from "../config/appConfig";
import { joinPayload, joinUrl } from "../utils/joinLink";

const call = (name, data) => functions().httpsCallable(name)(data).then((r) => r.data);

/** The class's link (made once; renew = a new link, the old one stops working) → { token, url }. */
export async function getClassLink(classId, { renew = false } = {}) {
  const { token } = await call("classLink", { classId, renew });
  return { token, url: joinUrl(JOIN_LINK_BASE, token) };
}
/** What a link points to → { classId, className, schoolName, grade, teacherNames }. */
export const classLinkInfo = (token) => call("classLinkInfo", { token });
/** The parent's one screen → { kidUid, firstName, className, isNew }. Throws a parent-friendly error first. */
export const joinClassByLink = (form) => call("joinClassByLink", joinPayload(form));
/** A student asks to join from their own phone → { className, teacherConfirms }. */
export const studentJoinByLink = ({ token, rollNo, parentMobile }) => call("studentJoinByLink", { token, rollNo, parentMobile });
/** Teacher: "Not sure" → the family goes on the follow-up list. */
export const markNotSure = (classId, kidUid) => call("markNotSure", { classId, kidUid });
/** Admin: everyone on the follow-up list. */
export const followUpList = () => call("followUpList", {}).then((r) => r.items || []);
