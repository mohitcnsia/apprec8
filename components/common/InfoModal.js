// components/common/InfoModal.js: a message with one button, now the app popup (mockup T5, AppDialog.js).
import React from "react";
import { DialogSheet } from "./AppDialog";

const InfoModal = ({ visible, title, message, onDismiss, dismissText = "OK" }) => (
  <DialogSheet visible={visible} title={title} message={message} onClose={() => {}} buttons={[{ text: dismissText, onPress: onDismiss }]} />
);

export default InfoModal;
