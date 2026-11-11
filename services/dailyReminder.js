// services/dailyReminder.js: the word-of-the-day reminder at 5 pm (owner, 2026-11-11: "5 pm reminder is good").
// Scheduled on the phone itself (expo-notifications, build 20.0.31+), no server and no cost. Each time the kid opens the
// app, the next 3 days' reminders are set again from tomorrow; so it only rings on a day the app wasn't opened, and
// after 3 quiet days it stops (no nagging). Each reminder names that day's word.
// Kids only (accounts with a class); the owner approved this one reminder for kids. Old builds: does nothing.
import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dayNumber, dailyCardFor, learnCardsFor, toWords } from "../utils/dailyCard";
import { bundledQuest } from "../data/quests";
import { nodesForGrade } from "../utils/gradeFilter";

const CHANNEL = "word-of-the-day";
const KIND = "word-reminder";
const ASKED = "wordReminderAsked.v1";
const HOUR = 17;

function lib() {
  // expo-notifications' native part exists only from build 20.0.31.
  if (!requireOptionalNativeModule("ExpoNotificationScheduler")) return null;
  try {
    return require("expo-notifications");
  } catch {
    return null;
  }
}

async function permitted(N) {
  const now = await N.getPermissionsAsync();
  if (now.granted) return true;
  if (!now.canAskAgain || (await AsyncStorage.getItem(ASKED).catch(() => null))) return false;
  await AsyncStorage.setItem(ASKED, "1").catch(() => {});
  return (await N.requestPermissionsAsync()).granted;
}

/** Call when Home knows the kid's class. Never throws. */
export async function scheduleWordReminders(grade) {
  const N = lib();
  if (!N || !Number.isInteger(grade)) return;
  try {
    if (!(await permitted(N))) return;
    if (Platform.OS === "android") {
      await N.setNotificationChannelAsync(CHANNEL, { name: "Word of the day", importance: N.AndroidImportance.DEFAULT });
    }
    const pending = await N.getAllScheduledNotificationsAsync();
    await Promise.all(pending.filter((p) => p.content?.data?.kind === KIND).map((p) => N.cancelScheduledNotificationAsync(p.identifier)));
    const words = toWords(learnCardsFor(bundledQuest("word-bank"), grade, nodesForGrade));
    const today = new Date();
    for (let ahead = 1; ahead <= 3; ahead++) {
      const at = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ahead, HOUR, 0);
      const { word } = dailyCardFor({ grade, now: at.getTime(), words });
      if (!word) continue;
      await N.scheduleNotificationAsync({
        content: {
          title: "Today's word is waiting",
          body: `Do you know what "${word.word}" means? Open Apprec8 to find out.`,
          data: { kind: KIND, day: dayNumber(at.getTime()), view: "home" },
        },
        trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
      });
    }
  } catch (e) {
    console.warn("scheduleWordReminders:", e?.message || e);
  }
}
