// utils/layout.js: tablets (owner, 16 Nov 2026: "despite the screen size the app should look consistent"). On a wide
// screen the content becomes a centred column, never stretched bars; buttons keep their phone size.
export const TABLET_MIN = 700; // dp: 10-inch tablets and big foldables
export const COLUMN_MAX = 640; // dp: the content column on a tablet

export const isTablet = (w) => w >= TABLET_MIN;
/** Style for a ScrollView's contentContainerStyle (or a screen's root) on any width. */
export const columnStyle = (w) => (isTablet(w) ? { width: "100%", maxWidth: COLUMN_MAX, alignSelf: "center" } : null);
/** The width the content actually has (screen width on phones, the column on tablets). */
export const contentWidth = (w) => (isTablet(w) ? Math.min(w, COLUMN_MAX) : w);
