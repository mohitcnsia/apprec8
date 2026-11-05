// navigation/navRef.js: lets components outside a screen (the guide strip) navigate.
import { createNavigationContainerRef } from "@react-navigation/native";

export const navRef = createNavigationContainerRef();

export function navigateTo(name, params) {
  if (navRef.isReady()) navRef.navigate(name, params);
}
