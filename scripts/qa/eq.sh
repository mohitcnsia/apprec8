#!/usr/bin/env bash
# QA helper for testing Apprec8 on the Android emulator (used by the QA agent, see docs/qa/QA_PLAYBOOK.md).
# Taps by VISIBLE TEXT instead of screen coordinates, so tests don't break when layouts move.
#
#   scripts/qa/eq.sh texts                 list visible texts (what's on screen now)
#   scripts/qa/eq.sh tap "Continue"        tap the element whose text contains "Continue"
#   scripts/qa/eq.sh tap "Stop" 2          tap the 2nd match
#   scripts/qa/eq.sh has "Practice saved"  exit 0 if the text is on screen, else 1
#   scripts/qa/eq.sh wait "Keep going" 15  wait up to 15 s for a text to appear
#   scripts/qa/eq.sh shot <name>           screenshot → $QA_OUT/<name>.png (default /tmp/apprec8-qa)
#   scripts/qa/eq.sh reload                reload the JS bundle (Metro must be running)
#   scripts/qa/eq.sh back                  Android back button
#   scripts/qa/eq.sh offline | online      airplane mode on / off
#   scripts/qa/eq.sh prep                  RUN FIRST: phone animations off (app loops stop, screen reads work)
#   scripts/qa/eq.sh unprep                phone animations back on
#   scripts/qa/eq.sh tapxy <x> <y>         tap a screen position (fallback when a text can't be found)
#
# Why "prep": uiautomator only reads a screen once it is still. With animations off, Android's
# "Remove animations" is on, and the app stops its looping animations (hooks/useReduceMotion.js).
# Each screen read also gives up after DUMP_TIMEOUT seconds (default 10) instead of hanging.
set -euo pipefail
export PATH="$HOME/Library/Android/sdk/platform-tools:/usr/local/bin:$PATH"
OUT="${QA_OUT:-/tmp/apprec8-qa}"
mkdir -p "$OUT"

DUMP_TIMEOUT="${DUMP_TIMEOUT:-10}"
dump() {
  adb shell rm -f /sdcard/eq-ui.xml >/dev/null 2>&1 || true
  # `timeout` runs on the device (toybox), so a screen that never goes still can't hang the run.
  if ! adb shell timeout "$DUMP_TIMEOUT" uiautomator dump /sdcard/eq-ui.xml >/dev/null 2>&1; then
    echo "WARN: screen read timed out after ${DUMP_TIMEOUT}s (did you run 'eq.sh prep'?)" >&2
  fi
  adb shell cat /sdcard/eq-ui.xml 2>/dev/null || true
}

# Prints "x y text" for nodes whose text or content-desc contains $1 (case-insensitive).
find_nodes() {
  dump | python3 -c '
import sys, re, html
needle = sys.argv[1].lower()
xml = sys.stdin.read()
for m in re.finditer(r"<node [^>]*>", xml):
    n = m.group(0)
    t = html.unescape((re.search(r"text=\"([^\"]*)\"", n) or [None, ""])[1])
    d = html.unescape((re.search(r"content-desc=\"([^\"]*)\"", n) or [None, ""])[1])
    label = d or t  # accessibility labels first: they sit on the tappable element
    b = re.search(r"bounds=\"\[(\d+),(\d+)\]\[(\d+),(\d+)\]\"", n)
    if label and b and needle in label.lower():
        x1, y1, x2, y2 = map(int, b.groups())
        print(0 if d else 1, (x1 + x2) // 2, (y1 + y2) // 2, label)
' "$1" | sort -s -k1,1n | cut -d" " -f2-
}

cmd="${1:-help}"; shift || true
case "$cmd" in
  texts)
    dump | python3 -c '
import sys, re, html
for t in re.findall(r"text=\"([^\"]+)\"", sys.stdin.read()):
    print(html.unescape(t))'
    ;;
  tap)
    nth="${2:-1}"
    line="$(find_nodes "$1" | sed -n "${nth}p")"
    if [ -z "$line" ]; then echo "NOT FOUND: $1" >&2; exit 1; fi
    read -r x y label <<<"$line"
    adb shell input tap "$x" "$y"
    echo "tapped: $label ($x,$y)"
    sleep 1
    ;;
  has)
    if [ -n "$(find_nodes "$1" | head -1)" ]; then echo "yes: $1"; else echo "no: $1"; exit 1; fi
    ;;
  wait)
    secs="${2:-15}"
    for _ in $(seq 1 "$secs"); do
      if [ -n "$(find_nodes "$1" | head -1)" ]; then echo "found: $1"; exit 0; fi
      sleep 1
    done
    echo "TIMEOUT waiting for: $1" >&2; exit 1
    ;;
  shot)
    adb shell screencap -p /sdcard/shot.png
    adb pull /sdcard/shot.png "$OUT/${1:-shot}.png" >/dev/null 2>&1
    echo "$OUT/${1:-shot}.png"
    ;;
  reload) adb shell input keyevent 46 46; sleep 10; echo "reloaded" ;;
  back) adb shell input keyevent 4; sleep 1 ;;
  prep)
    for k in window_animation_scale transition_animation_scale animator_duration_scale; do
      adb shell settings put global "$k" 0
    done
    echo "animations OFF. Restart the app (or 'eq.sh reload') so it sees the setting."
    ;;
  unprep)
    for k in window_animation_scale transition_animation_scale animator_duration_scale; do
      adb shell settings put global "$k" 1
    done
    echo "animations ON"
    ;;
  tapxy) adb shell input tap "$1" "$2"; echo "tapped ($1,$2)"; sleep 1 ;;
  offline) adb shell cmd connectivity airplane-mode enable; echo "airplane mode ON" ;;
  online) adb shell cmd connectivity airplane-mode disable; echo "airplane mode OFF" ;;
  *) sed -n '2,23p' "$0" ;;
esac
