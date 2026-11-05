// services/remoteLists.js: small lists kept in Remote Config instead of code (e.g. "free_text_emails"), so personal
// data like a child's email never goes into the repo. Read after useInAppMessaging has fetched + activated; until then
// it returns the last activated value (or empty). Never throws.
import remoteConfig from "@react-native-firebase/remote-config";

export function remoteList(key) {
  try {
    const raw = remoteConfig().getValue(key).asString().trim();
    if (!raw) return [];
    if (raw.startsWith("[")) return JSON.parse(raw).map(String);
    return raw.split(",").map((x) => x.trim()).filter(Boolean);
  } catch {
    return [];
  }
}
