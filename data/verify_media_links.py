#!/usr/bin/env python3
"""
verify_media_links.py

Walks a quiz JSON file (like your Space Olympiad question bank), finds every
"mediaUrl" field, and checks whether it's actually reachable.

- Images: sends a HEAD request (falls back to GET if HEAD isn't allowed),
  confirms a 2xx status and an image/* content-type.
- YouTube videos: uses YouTube's public oEmbed endpoint, which returns a
  clean JSON error if the video is private, deleted, or region-locked,
  without needing an API key.

Usage:
    pip install requests --break-system-packages
    python3 verify_media_links.py path/to/your_quiz.json

Output:
    Prints a summary to the console AND writes media_link_report.csv
    with one row per media link: quiz, question (truncated), type, url, status.
"""

import json
import sys
import csv
import re
import time
from urllib.parse import urlparse, parse_qs

try:
    import requests
except ImportError:
    print("This script needs the 'requests' library.")
    print("Install it with: pip install requests --break-system-packages")
    sys.exit(1)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; QuizLinkChecker/1.0)"
}


def get_youtube_id(url):
    parsed = urlparse(url)
    if "youtu.be" in parsed.netloc:
        return parsed.path.lstrip("/")
    if "youtube.com" in parsed.netloc:
        qs = parse_qs(parsed.query)
        if "v" in qs:
            return qs["v"][0]
        # handle /embed/VIDEOID or /shorts/VIDEOID
        m = re.search(r"/(embed|shorts)/([A-Za-z0-9_-]{6,})", parsed.path)
        if m:
            return m.group(2)
    return None


def check_youtube(url):
    vid = get_youtube_id(url)
    if not vid:
        return "UNKNOWN", "Could not parse video ID"
    oembed = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    try:
        r = requests.get(oembed, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            title = r.json().get("title", "")
            return "OK", title
        elif r.status_code in (401, 403, 404):
            return "BROKEN", f"oEmbed returned {r.status_code} (private/deleted/removed)"
        else:
            return "UNKNOWN", f"oEmbed returned {r.status_code}"
    except requests.RequestException as e:
        return "ERROR", str(e)


def check_image(url):
    try:
        r = requests.head(url, headers=HEADERS, timeout=10, allow_redirects=True)
        if r.status_code >= 400 or r.status_code == 405:
            # some servers (incl. Wikimedia sometimes) reject HEAD; retry with GET (stream, don't download body)
            r = requests.get(url, headers=HEADERS, timeout=15, stream=True, allow_redirects=True)
        ctype = r.headers.get("Content-Type", "")
        if 200 <= r.status_code < 300:
            if ctype.startswith("image/"):
                return "OK", ctype
            else:
                return "SUSPECT", f"200 OK but content-type is '{ctype}', not an image"
        else:
            return "BROKEN", f"HTTP {r.status_code}"
    except requests.RequestException as e:
        return "ERROR", str(e)


def walk(obj, quiz_title="", question_text="", rows=None):
    if rows is None:
        rows = []
    if isinstance(obj, dict):
        if "title" in obj and "questions" in obj:
            quiz_title = obj.get("title", quiz_title)
        if "question" in obj and isinstance(obj["question"], str):
            question_text = obj["question"]
        if "mediaUrl" in obj and obj["mediaUrl"]:
            media_type = obj.get("mediaType", "unknown")
            rows.append({
                "quiz": quiz_title,
                "question": question_text[:70],
                "mediaType": media_type,
                "url": obj["mediaUrl"],
            })
        for v in obj.values():
            walk(v, quiz_title, question_text, rows)
    elif isinstance(obj, list):
        for item in obj:
            walk(item, quiz_title, question_text, rows)
    return rows


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 verify_media_links.py path/to/your_quiz.json")
        sys.exit(1)

    with open(sys.argv[1], "r", encoding="utf-8") as f:
        data = json.load(f)

    rows = walk(data)
    print(f"Found {len(rows)} media links. Checking each one (this may take a minute)...\n")

    seen = {}  # cache so repeated URLs (e.g. reused images) are only fetched once
    results = []
    for i, row in enumerate(rows, 1):
        url = row["url"]
        if url in seen:
            status, detail = seen[url]
        else:
            if row["mediaType"] == "video" and ("youtube.com" in url or "youtu.be" in url):
                status, detail = check_youtube(url)
            else:
                status, detail = check_image(url)
            seen[url] = (status, detail)
            time.sleep(0.15)  # be polite

        row["status"] = status
        row["detail"] = detail
        results.append(row)
        flag = "✅" if status == "OK" else "⚠️ " if status == "SUSPECT" else "❌"
        print(f"{flag} [{i}/{len(rows)}] {row['quiz']} — {row['question']} -> {status}")

    broken = [r for r in results if r["status"] in ("BROKEN", "ERROR", "SUSPECT")]

    with open("media_link_report.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["quiz", "question", "mediaType", "url", "status", "detail"])
        writer.writeheader()
        writer.writerows(results)

    print("\n" + "=" * 60)
    print(f"Checked {len(results)} links ({len(seen)} unique URLs).")
    print(f"{len(broken)} need attention.")
    print("Full report written to media_link_report.csv")
    if broken:
        print("\nLinks needing attention:")
        for r in broken:
            print(f" - [{r['quiz']}] {r['question']} -> {r['url']}  ({r['detail']})")


if __name__ == "__main__":
    main()
