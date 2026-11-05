// components/common/ConfirmationModel.js: yes / no popup, now the app popup (mockup T5, components/common/AppDialog.js).
// Before 2026-11-05 it ignored confirmText / cancelText / message and always showed "Confirm" / "Cancel".
import React from "react";
import { DialogSheet } from "./AppDialog";
import { looksDestructive } from "../../utils/dialogButtons";

const ConfirmationModal = ({ visible, title, message, onCancel, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => (
  <DialogSheet
    visible={visible}
    title={title}
    message={message}
    onClose={() => {}}
    buttons={[
      { text: cancelText, style: "cancel", onPress: onCancel },
      { text: confirmText, style: looksDestructive(confirmText) ? "destructive" : "default", onPress: onConfirm },
    ]}
  />
);

export default ConfirmationModal;
