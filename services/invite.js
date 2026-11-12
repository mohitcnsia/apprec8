// services/invite.js: the one class invite every teacher sends (owner, 12 Nov). Steps end at the app's own
// "Join your class" button; no class link, so there is one way in. Message text: utils/joinLink.js inviteMessage.
import { Share } from "react-native";
import { inviteMessage } from "../utils/joinLink";
import { IN_CLOSED_TESTING, TESTER_GROUP_URL, TESTER_OPTIN_URL, PLAY_STORE_URL } from "../config/appConfig";

export function shareInvite({ className, schoolName, teacherName = null }) {
  const testing = IN_CLOSED_TESTING ? { groupUrl: TESTER_GROUP_URL, optInUrl: TESTER_OPTIN_URL } : null;
  return Share.share({ message: inviteMessage({ className, schoolName, teacherName, storeUrl: PLAY_STORE_URL, testing }) });
}
