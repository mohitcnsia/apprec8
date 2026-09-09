import json
import os
import requests
import time
from urllib.parse import unquote, urlparse

# Headers with a contact email as requested by Wikimedia API policy
HEADERS = {
    'User-Agent': 'SpaceOlympiadApp/1.0 (mohitchilkoti+cnsia@gmail.com)'
}

MEDIA_DIR = "data/media_backup"
os.makedirs(MEDIA_DIR, exist_ok=True)

with open("data/space_olympiad_data.json", "r") as f:
    quiz_data = json.load(f)

# Keep track of filenames we've processed to avoid downloading multiple times
processed_files = {}

def process_url(old_url):
    if "upload.wikimedia.org" not in old_url:
        return old_url

    parsed_url = urlparse(old_url)
    filename = os.path.basename(parsed_url.path)
    filename = unquote(filename)
    
    if filename in processed_files:
        return processed_files[filename]
        
    print(f"Resolving: {filename}")
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles=File:{filename}&prop=imageinfo&iiprop=url&format=json"
    
    try:
        response = requests.get(api_url, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        
        pages = data.get("query", {}).get("pages", {})
        page = list(pages.values())[0]
        
        if "imageinfo" in page:
            new_wiki_url = page["imageinfo"][0]["url"]
            print(f"  -> Found new URL: {new_wiki_url}")
            
            # Download the image
            local_path = os.path.join(MEDIA_DIR, filename)
            if not os.path.exists(local_path):
                img_resp = requests.get(new_wiki_url, headers=HEADERS)
                img_resp.raise_for_status()
                with open(local_path, "wb") as img_file:
                    img_file.write(img_resp.content)
                print(f"  -> Downloaded to {local_path}")
            else:
                print(f"  -> Already exists locally")
                
            new_jsdelivr_url = f"https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/{filename}"
            processed_files[filename] = new_jsdelivr_url
            
            # Be polite to Wikimedia API
            time.sleep(0.5)
            return new_jsdelivr_url
        else:
            print(f"  -> Not found in API.")
            processed_files[filename] = old_url
            return old_url
            
    except Exception as e:
        print(f"  -> Error: {e}")
        processed_files[filename] = old_url
        return old_url

def update_urls(obj):
    if isinstance(obj, dict):
        if "mediaUrl" in obj and isinstance(obj["mediaUrl"], str):
            obj["mediaUrl"] = process_url(obj["mediaUrl"])
        if "image" in obj and isinstance(obj["image"], str): # Just in case some use 'image'
            obj["image"] = process_url(obj["image"])
        for k, v in obj.items():
            update_urls(v)
    elif isinstance(obj, list):
        for item in obj:
            update_urls(item)

print("Starting scan...")
update_urls(quiz_data)

with open("data/space_olympiad_data.json", "w") as f:
    json.dump(quiz_data, f, indent=2)

print("Done updating JSON!")
