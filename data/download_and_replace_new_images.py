import json
import os
import requests
import hashlib
from urllib.parse import urlparse, unquote

def safe_filename(url):
    parsed = urlparse(url)
    name = unquote(os.path.basename(parsed.path))
    if not name or len(name) > 120:
        ext = os.path.splitext(name)[1] or ".jpg"
        name = hashlib.sha1(url.encode()).hexdigest()[:16] + ext
    return name

def walk_media_urls(obj, found=None):
    if found is None:
        found = []
    if isinstance(obj, dict):
        if obj.get("mediaType") == "image" and obj.get("mediaUrl"):
            if "wikimedia.org" in obj["mediaUrl"]:
                found.append(obj["mediaUrl"])
        for v in obj.values():
            walk_media_urls(v, found)
    elif isinstance(obj, list):
        for item in obj:
            walk_media_urls(item, found)
    return found

def update_urls(obj, url_dict):
    if isinstance(obj, dict):
        if obj.get("mediaUrl") in url_dict:
            obj["mediaUrl"] = url_dict[obj["mediaUrl"]]
        for k, v in obj.items():
            update_urls(v, url_dict)
    elif isinstance(obj, list):
        for item in obj:
            update_urls(item, url_dict)

def main():
    json_path = "/Users/mohitchilkoti/Documents/projects/apprec8/data/space_olympiad_data.json"
    out_dir = "/Users/mohitchilkoti/Documents/projects/apprec8/data/media_new"
    os.makedirs(out_dir, exist_ok=True)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    urls = sorted(set(walk_media_urls(data)))
    print(f"Found {len(urls)} new wikimedia URLs to download.\n")

    mapping = []
    url_dict = {}
    
    for i, url in enumerate(urls, 1):
        fname = safe_filename(url)
        dest = os.path.join(out_dir, fname)
        
        try:
            r = requests.get(url, headers={"User-Agent": "Apprec8Bot/1.0 (mohitcnsia@gmail.com)"}, timeout=20)
            r.raise_for_status()
            with open(dest, "wb") as out:
                out.write(r.content)
            print(f"[{i}/{len(urls)}] Downloaded {fname} ({len(r.content)//1024} KB)")
            mapping.append({"original_url": url, "local_file": fname, "status": "OK"})
            
            new_url = f"https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/{fname}"
            url_dict[url] = new_url
            
        except requests.RequestException as e:
            print(f"[{i}/{len(urls)}] FAILED: {url} ({e})")
            mapping.append({"original_url": url, "local_file": "", "status": f"FAILED: {e}"})

    with open(os.path.join(out_dir, "url_mapping.json"), "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2)

    # Update JSON
    update_urls(data, url_dict)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    print(f"\nReplaced {len(url_dict)} wikimedia URLs with CDN URLs in space_olympiad_data.json.")

if __name__ == "__main__":
    main()
