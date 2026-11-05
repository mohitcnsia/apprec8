// context/FreeTextContext.js: whether the signed-in user may type free text to us (utils/freeText.js).
// Set once in AppContent from the user doc it already listens to; read by the report / feedback / contact boxes.
import { createContext, useContext } from "react";

export const FreeTextContext = createContext(false);
export const useCanWriteFreeText = () => useContext(FreeTextContext);
