#!/usr/bin/env bash
# Checks a test APK before distribution to App Distribution.
# Usage: scripts/release/check-test-apk.sh <file.apk> <expected versionName, e.g. 20.0.32>
set -u
APK="${1:-}"; WANT="${2:-}"
if [ -z "$APK" ] || [ -z "$WANT" ] || [ ! -f "$APK" ]; then
  echo "Usage: $0 <file.apk> <expected versionName>"; exit 2
fi

SDK_BUILD_TOOLS="$(find "${ANDROID_HOME:-$HOME/Library/Android/sdk}/build-tools" -maxdepth 1 -mindepth 1 2>/dev/null | sort -V | tail -n 1)"
AAPT2="${SDK_BUILD_TOOLS}/aapt2"
APKSIGNER="${SDK_BUILD_TOOLS}/apksigner"

FAIL=0
ok()  { echo "  ✅ $1"; }
bad() { echo "  ❌ $1"; FAIL=1; }

echo "Checking test APK: $APK"

# 1. Check badging for package name and versionName
if [ -x "$AAPT2" ]; then
  BADGING="$("$AAPT2" dump badging "$APK" 2>/dev/null)"
  if echo "$BADGING" | grep -q "name='com.mohitchilkoti.apprec8.test'"; then
    ok "package com.mohitchilkoti.apprec8.test"
  else
    bad "package com.mohitchilkoti.apprec8.test not found"
  fi

  if echo "$BADGING" | grep -q "versionName='$WANT'"; then
    ok "versionName $WANT"
  else
    bad "versionName $WANT not found"
  fi

  XMLTREE="$("$AAPT2" dump xmltree --file AndroidManifest.xml "$APK" 2>/dev/null)"
  if echo "$XMLTREE" | grep -q '"{"expo-channel-name":"preview"}"'; then
    ok "EAS channel preview (never production)"
  else
    bad "EAS channel preview not found in manifest"
  fi
else
  TMP="$(mktemp -d)"
  unzip -q -o "$APK" 'AndroidManifest.xml' -d "$TMP" 2>/dev/null
  if grep -a -q -F "com.mohitchilkoti.apprec8.test" "$TMP/AndroidManifest.xml" 2>/dev/null; then ok "package com.mohitchilkoti.apprec8.test"
  else bad "package com.mohitchilkoti.apprec8.test not found"; fi

  if grep -a -q -F "$WANT" "$TMP/AndroidManifest.xml" 2>/dev/null; then ok "versionName $WANT"
  else bad "versionName $WANT not found"; fi

  if grep -a -q -F "preview" "$TMP/AndroidManifest.xml" 2>/dev/null; then ok "EAS channel preview (never production)"
  else bad "EAS channel preview not found"; fi
  rm -rf "$TMP"
fi

# 2. Check signature
if [ -x "$APKSIGNER" ]; then
  if "$APKSIGNER" verify "$APK" >/dev/null 2>&1; then
    ok "signed"
  else
    bad "not signed or invalid signature"
  fi
else
  TMP_META="$(mktemp -d)"
  unzip -q -o "$APK" 'META-INF/*' -d "$TMP_META" 2>/dev/null
  if [ -n "$(find "$TMP_META" -maxdepth 1 \( -name '*.RSA' -o -name '*.EC' -o -name '*.DSA' \) 2>/dev/null)" ]; then ok "signed"
  else bad "not signed"; fi
  rm -rf "$TMP_META"
fi

[ "$FAIL" -eq 0 ] && echo "PASS: ready to distribute to test app" || echo "FAIL: don't distribute"
exit "$FAIL"
