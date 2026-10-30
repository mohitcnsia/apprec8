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
set -euo pipefail
OUT="${QA_OUT:-/tmp/apprec8-qa}"
mkdir -p "$OUT"

dump() {
  adb shell uiautomator dump /sdcard/eq-ui.xml >/dev/null 2>&1 || true
  adb shell cat /sdcard/eq-ui.xml
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
    adb exec-out screencap -p > "$OUT/${1:-shot}.png"
    echo "$OUT/${1:-shot}.png"
    ;;
  reload) adb shell input keyevent 46 46; sleep 10; echo "reloaded" ;;
  back) adb shell input keyevent 4; sleep 1 ;;
  offline) adb shell cmd connectivity airplane-mode enable; echo "airplane mode ON" ;;
  online) adb shell cmd connectivity airplane-mode disable; echo "airplane mode OFF" ;;
  *) sed -n '2,15p' "$0" ;;
esac
