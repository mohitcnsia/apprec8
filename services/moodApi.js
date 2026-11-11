// services/moodApi.js: the weekly mood check (functions/callable/moodActions.js). Mood taps never touch Firestore from
// the phone: everything goes through these server functions, which only the counsellor (and her backup) can read.
import functions from "@react-native-firebase/functions";

const call = (name, data = {}) => functions().httpsCallable(name)(data).then((r) => r.data);

export const recordMood = (mood, { span = null, tellCounsellor = false } = {}) => call("recordMood", { mood, span, tellCounsellor });
export const myMoodList = () => call("myMoodList");
export const setMoodOutcome = (id, outcome) => call("setMoodOutcome", { id, outcome });
export const setCounsellorAway = (away) => call("setCounsellorAway", { away });
export const amICounsellor = () => call("amICounsellor");

// Teachers appreciate (a public sticker) or nudge / cheer on (a private note) kids (functions/callable/stickerActions.js).
export const sendSticker = (classId, kind, toUids, topic) => call("sendSticker", { classId, kind, toUids, topic });
