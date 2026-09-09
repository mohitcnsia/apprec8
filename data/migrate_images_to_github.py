#!/usr/bin/env python3
"""
migrate_images_to_github.py

Downloads every IMAGE mediaUrl referenced in your quiz JSON into a local
folder, so you can push that folder to a public GitHub repo and hotlink
the images from raw.githubusercontent.com forever (or until you delete
the repo) — no dependency on Wikimedia, Unsplash, imgur, etc. staying up.

Usage:
    pip install requests --break-system-packages
    python3 migrate_images_to_github.py path/to/your_quiz.json ./media_backup

Then:
    1. Create a new PUBLIC repo on github.com, e.g. "space-olympiad-media"
    2. Copy the downloaded folder's contents into that repo
    3. git add . && git commit -m "add quiz media" && git push
    4. Use the URLs printed in url_mapping.json (or url_mapping.csv) to
       update your quiz JSON's mediaUrl fields — they'll point at
       raw.githubusercontent.com/<you>/<repo>/main/<filename>

NOTE ON RIGHTS: this only downloads files that are already freely licensed
for reuse (Wikimedia Commons files are public domain or Creative Commons;
NASA imagery is public domain in the US). Always keep the original source
URL on hand in case you ever need to credit it — the mapping file below
preserves that for you.
"""

import json
import sys
import os
import hashlib
import csv
from urllib.parse import urlparse, unquote

try:
    import requests
except ImportError:
    print("This script needs the 'requests' library.")
    print("Install it with: pip install requests --break-system-packages")
    sys.exit(1)

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; QuizMediaMigrator/1.0)"}


def walk_media_urls(obj, media_type_filter="image", found=None):
    if found is None:
        found = []
    if isinstance(obj, dict):
        if obj.get("mediaType") == media_type_filter and obj.get("mediaUrl"):
            found.append(obj["mediaUrl"])
        for v in obj.values():
            walk_media_urls(v, media_type_filter, found)
    elif isinstance(obj, list):
        for item in obj:
            walk_media_urls(item, media_type_filter, found)
    return found


def safe_filename(url):
    parsed = urlparse(url)
    name = unquote(os.path.basename(parsed.path))
    if not name or len(name) > 120:
        ext = os.path.splitext(name)[1] or ".jpg"
        name = hashlib.sha1(url.encode()).hexdigest()[:16] + ext
    return name


def main():
    if len(sys.argv) < 3:
        print("Usage: python3 migrate_images_to_github.py path/to/your_quiz.json ./output_folder")
        sys.exit(1)

    json_path, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    urls = sorted(set(walk_media_urls(data)))
    print(f"Found {len(urls)} unique image URLs to download.\n")

    mapping = []
    for i, url in enumerate(urls, 1):
        fname = safe_filename(url)
        dest = os.path.join(out_dir, fname)
        # avoid collisions
        base, ext = os.path.splitext(fname)
        n = 1
        while os.path.exists(dest) and os.path.getsize(dest) > 0:
            # check if it's actually the same file we already saved (skip re-download of dup)
            break
        try:
            import time
            time.sleep(1)
            r = requests.get(url, headers={"User-Agent": "QuizMediaMigrator/1.0 (mohitcnsia@gmail.com)"}, timeout=20)
            r.raise_for_status()
            with open(dest, "wb") as out:
                out.write(r.content)
            print(f"[{i}/{len(urls)}] Downloaded {fname} ({len(r.content)//1024} KB)")
            mapping.append({"original_url": url, "local_file": fname, "status": "OK"})
        except requests.RequestException as e:
            print(f"[{i}/{len(urls)}] FAILED: {url} ({e})")
            mapping.append({"original_url": url, "local_file": "", "status": f"FAILED: {e}"})

    with open(os.path.join(out_dir, "url_mapping.json"), "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2)

    with open(os.path.join(out_dir, "url_mapping.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["original_url", "local_file", "status"])
        writer.writeheader()
        writer.writerows(mapping)

    ok = [m for m in mapping if m["status"] == "OK"]
    print(f"\nDone. {len(ok)}/{len(urls)} images downloaded successfully into '{out_dir}'.")
    print("Mapping saved to url_mapping.json / url_mapping.csv")
    print("\nNext steps:")
    print("  1. Create a public GitHub repo, e.g. 'space-olympiad-media'")
    print(f"  2. Copy everything in '{out_dir}' into that repo and push it")
    print("  3. Your new stable URLs will look like:")
    print("     https://raw.githubusercontent.com/<your-username>/space-olympiad-media/main/<local_file>")
    print("  4. Use url_mapping.csv to find-and-replace old mediaUrl values with the new ones in your quiz JSON")


if __name__ == "__main__":
    main()
