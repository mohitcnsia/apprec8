#!/usr/bin/env bash
# Checks a release .aab before it goes to Play. Run it on every build before upload.
# Usage: scripts/release/check-aab.sh <file.aab> <expected versionName, e.g. 20.0.24>
# Checks: versionName, admin ID inside the JS bundle (Dashboard + seed buttons), signature.
set -u
AAB="${1:-}"; WANT="${2:-}"
ADMIN_UID="ThOziLzf1INR9K9hxZQxOMgjcJD3"
if [ -z "$AAB" ] || [ -z "$WANT" ] || [ ! -f "$AAB" ]; then
  echo "Usage: $0 <file.aab> <expected versionName>"; exit 2
fi
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
unzip -q -o "$AAB" 'base/manifest/AndroidManifest.xml' 'base/assets/index.android.bundle' 'META-INF/*' -d "$TMP" 2>/dev/null
FAIL=0
ok()  { echo "  ✅ $1"; }
bad() { echo "  ❌ $1"; FAIL=1; }

echo "Checking $AAB"
if grep -a -q -F "$WANT" "$TMP/base/manifest/AndroidManifest.xml" 2>/dev/null; then ok "versionName $WANT"
else bad "versionName $WANT not found (bump app.config.js AND android/app/build.gradle)"; fi

if grep -a -q -F "$ADMIN_UID" "$TMP/base/assets/index.android.bundle" 2>/dev/null; then ok "admin ID in the app (Dashboard will show)"
else bad "admin ID missing from the JS bundle: the owner won't see the Dashboard or seed buttons"; fi

if [ -n "$(find "$TMP/META-INF" -maxdepth 1 \( -name '*.RSA' -o -name '*.EC' -o -name '*.DSA' \) 2>/dev/null)" ]; then ok "signed"
else bad "not signed"; fi

[ "$FAIL" -eq 0 ] && echo "PASS: ready to upload" || echo "FAIL: don't upload"
exit "$FAIL"
