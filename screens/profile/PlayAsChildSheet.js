// screens/profile/PlayAsChildSheet.js
// "Play as <child>" (mockup N1, owner-approved 2026-11-05; owner: "Pratha took the phone and watched YouTube instead").
// Lock the phone to Apprec8 (Android screen pinning: leaving needs the phone's own PIN) and pick how long. When time is
// up, TimeUpOverlay asks the child to hand the phone back; the parent's app PIN switches back and unpins.

import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Sheet from "../../components/common/Sheet";
import { makeSchoolStyles, Chip, MainButton } from "../admin/schoolUi";
import { DURATIONS, durationLabel } from "../../utils/playSession";
import { startSession, endSession, lockAvailable } from "../../services/playSession";
import { playAsChild, deleteChild } from "../../services/familyApi";
import { showAlert } from "../../services/dialog";

export default function PlayAsChildSheet({ kid, onClose, onLoginCode, P }) {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const [minutes, setMinutes] = useState(30);
  const [busy, setBusy] = useState(false);
  const name = kid?.firstName || "your child";
  const canLock = lockAvailable();

  const go = async (lock) => {
    setBusy(true);
    try {
      await startSession({ childUid: kid.uid, childName: name, minutes, lock });
      await playAsChild(kid.uid);
      onClose();
    } catch (e) {
      await endSession(); // don't leave the phone pinned if the switch failed
      showAlert("Couldn't switch", e?.message || String(e));
    }
    setBusy(false);
  };

  // Play and DPDP: a parent can delete a child profile they made, with all its progress (functions/utils/eraseUser.js).
  const removeProfile = () =>
    showAlert(`Delete ${name}'s profile?`, `${name}'s progress, answers, stars and class places are deleted for good. This can't be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setBusy(true);
          try {
            await deleteChild(kid.uid);
            onClose();
          } catch (e) {
            showAlert("Couldn't delete", e?.message || String(e));
          }
          setBusy(false);
        },
      },
    ]);

  return (
    <Sheet visible={!!kid} onClose={onClose} title={`Play as ${name}`} subtitle={kid?.grade ? `Class ${kid.grade}` : null} P={P}>
      <View style={[styles.codeCard, { alignItems: "flex-start" }]}>
        <Ionicons name="lock-closed-outline" size={24} color={P.selectedText} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.text, { color: P.selectedText }]}>Lock the phone to Apprec8</Text>
          <Text style={[styles.small, { color: P.label }]}>
            {canLock
              ? "No YouTube, no games, no calls going out. To unlock, you need your phone's own PIN or pattern."
              : "Update Apprec8 to use the lock. Until then: phone Settings → Security → App pinning → On, then pin Apprec8 from Recent apps."}
          </Text>
        </View>
      </View>

      <Text style={styles.label}>HOW LONG?</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {DURATIONS.map((m) => (
          <View key={String(m)} style={{ flex: 1 }}>
            <Chip label={durationLabel(m)} on={minutes === m} onPress={() => setMinutes(m)} styles={styles} />
          </View>
        ))}
      </View>
      {minutes ? (
        <Text style={styles.dim}>When time is up, Chamak says "Great work! Give the phone back to Mummy or Papa." and the app pauses.</Text>
      ) : null}
      {canLock ? (
        <Text style={styles.dim}>
          The first time, Android asks you to confirm "Pin this app?". Tap <Text style={{ color: P.text }}>Got it</Text>.
        </Text>
      ) : null}

      {canLock ? <MainButton label={`LOCK & PLAY AS ${name.toUpperCase()}`} onPress={() => go(true)} busy={busy} styles={styles} P={P} /> : null}
      <Pressable onPress={() => go(false)} disabled={busy} accessibilityRole="button" style={[styles.smallButton, { minHeight: 48, borderColor: P.border, backgroundColor: "transparent" }]}>
        <Text style={[styles.smallButtonText, { color: canLock ? P.textSoft : P.selectedText }]}>{canLock ? "Play without lock" : `Play as ${name}`}</Text>
      </Pressable>
      {/* "Get a login code" removed with the child codes (owner, 2026-11-12). */}
      <Pressable onPress={removeProfile} disabled={busy} accessibilityRole="button" style={[styles.link, { justifyContent: "center" }]}>
        <Text style={[styles.dim, { color: P.wrongText }]}>Delete {name}'s profile</Text>
      </Pressable>
    </Sheet>
  );
}
