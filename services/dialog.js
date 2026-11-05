// services/dialog.js: showAlert(title, message, buttons, options), the same arguments as React Native's Alert.alert,
// shown as the app's own popup (components/common/AppDialog.js, mockup T5). Until the host is mounted (very early
// start-up), it falls back to the system popup so nothing is ever lost.
import { Alert } from "react-native";

let host = null;
export const setDialogHost = (h) => {
  host = h;
};

export function showAlert(title, message, buttons, options) {
  if (!host) return Alert.alert(title, message, buttons, options);
  host.show({ title: title ?? "", message: message ?? "", buttons, options });
}
