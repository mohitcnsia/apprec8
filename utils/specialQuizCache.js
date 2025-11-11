import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "@react-native-firebase/firestore";
import { db } from "../config/firebaseConfig";

const SPECIAL_CACHE_KEY = "specialQuizIdsCache_v1";
const CACHE_EXPIRY_HOURS = 12;

export async function getSpecialQuizIds() {
  try {
    // Step 1: Check cache first
    const cached = await AsyncStorage.getItem(SPECIAL_CACHE_KEY);
    if (cached) {
      const { quizIds, timestamp } = JSON.parse(cached);
      const isExpired =
        Date.now() - timestamp > CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
      if (!isExpired && Array.isArray(quizIds)) {
        return quizIds;
      }
    }

    // Step 2: Fetch fresh list from Firestore
    const snapshot = await getDocs(collection(db, "specialQuizzes"));
    const quizIds = snapshot.docs
      .filter((doc) => doc.data()?.active)
      .map((doc) => doc.id);

    // Step 3: Cache it
    await AsyncStorage.setItem(
      SPECIAL_CACHE_KEY,
      JSON.stringify({ quizIds, timestamp: Date.now() })
    );

    return quizIds;
  } catch (error) {
    console.error("Error fetching special quiz IDs:", error);
    return [];
  }
}
