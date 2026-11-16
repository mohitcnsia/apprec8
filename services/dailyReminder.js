// services/dailyReminder.js: the word of the day at 6:30 am and a short 7:30 pm nudge (owner, 16 Nov 2026: "kids get
// up early"; was one reminder at 5 pm from 2026-11-11).
// Scheduled on the phone itself (expo-notifications, build 20.0.31+), no server and no cost. Each time the kid opens the
// app, the next 3 days' reminders are set again from tomorrow; so it only rings on a day the app wasn't opened, and
// after 3 quiet days it stops (no nagging). Each reminder names that day's word.
// Kids only (accounts with a class); the owner approved this one reminder for kids. Old builds: does nothing.
import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dayNumber, dailyCardFor, learnCardsFor, toWords, wordMeaning } from "../utils/dailyCard";
import { bundledQuest } from "../data/quests";
import { nodesForGrade } from "../utils/gradeFilter";

const CHANNEL = "word-of-the-day";
const KIND = "word-reminder";
const ASKED = "wordReminderAsked.v1";
const MORNING = [6, 30]; // the word, to use at school that day
const EVENING = [19, 30]; // only rings on a day the app wasn't opened (see below)

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
      const at = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ahead, MORNING[0], MORNING[1]);
      const { word } = dailyCardFor({ grade, now: at.getTime(), words });
      if (word) {
        await N.scheduleNotificationAsync({
          content: {
            title: word.word.toUpperCase(),
            body: `${wordMeaning(word.meaning)} Try using it once at school today.`,
            data: { kind: KIND, day: dayNumber(at.getTime()), view: "home" },
          },
          trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
        });
      }
      const eve = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ahead, EVENING[0], EVENING[1]);
      await N.scheduleNotificationAsync({
        content: {
          title: "A quick round tonight?",
          body: "One short round keeps your streak going.",
          data: { kind: KIND, day: dayNumber(eve.getTime()), view: "home" },
        },
        trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: eve, channelId: CHANNEL },
      });
    }
  } catch (e) {
    console.warn("scheduleWordReminders:", e?.message || e);
  }
}
