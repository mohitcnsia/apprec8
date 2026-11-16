// components/me/FacePickerSheet.js: pick your face (owner, 16 Nov 2026). A character everyone sees, or a photo that stays
// only on this phone.
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Sheet from "../common/Sheet";
import Face from "../common/Face";
import AppButton from "../common/AppButton";
import { FACES } from "../../utils/faces";
import { pickPhoto, removePhoto, setCharacter, useLocalPhoto, canPickPhoto } from "../../services/face";
import { showAlert } from "../../services/dialog";

export default function FacePickerSheet({ visible, onClose, uid, avatar, name, P }) {
  const photo = useLocalPhoto(uid);
  const [busy, setBusy] = useState(false);
  const pick = async (id) => {
    try {
      await setCharacter(id);
      if (!photo) onClose();
    } catch (e) {
      showAlert("Couldn't save", "Please check your internet and try again.");
    }
  };
  return (
    <Sheet visible={visible} onClose={onClose} title="Your face" subtitle="Pick a character. Everyone in your class sees it." P={P}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {FACES.map((f) => (
          <Pressable key={f.id} onPress={() => pick(f.id)} accessibilityRole="radio" accessibilityState={{ selected: avatar === f.id }} accessibilityLabel={`Face: ${f.id}`} hitSlop={4}>
            <Face size={56} avatar={f.id} ring={avatar === f.id ? P.selectedBorder : null} />
          </Pressable>
        ))}
      </View>
      {canPickPhoto() ? (
      <View style={{ gap: 8, marginTop: 8 }}>
        <Text style={{ fontFamily: "nunitoBold", fontSize: 15, color: P.text }}>Or your own photo</Text>
        <Text style={{ fontFamily: "nunito", fontSize: 13, color: P.textSoft }}>
          Your photo stays on this phone. It is never sent anywhere, and only this phone shows it.
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {photo ? <Face size={48} uid={uid} name={name} /> : null}
          <AppButton
            variant="soft"
            icon="image-outline"
            label={photo ? "Change photo" : "Choose a photo"}
            busy={busy}
            onPress={async () => {
              setBusy(true);
              try {
                await pickPhoto();
              } catch (e) {
                showAlert("Couldn't use that photo", e?.message || String(e));
              }
              setBusy(false);
            }}
          />
          {photo ? <AppButton variant="danger" icon="trash-outline" accessibilityLabel="Remove my photo" onPress={removePhoto} /> : null}
        </View>
      </View>
      ) : null}
    </Sheet>
  );
}
