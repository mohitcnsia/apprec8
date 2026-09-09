import json
import os
import requests

HEADERS = {
    'User-Agent': 'SpaceOlympiadApp/1.0 (mohitchilkoti+cnsia@gmail.com)'
}

MEDIA_DIR = "data/media_backup"

replacements = {
    "Edwin_Hubble.jpg": {
        "bad_url": "https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/Astronaut_Edwin_Aldrin_descends_the_Lunar_Module_ladder,_AS11-40-5868_(21037483754).jpg",
        "wiki_title": "File:Studio portrait photograph of Edwin Powell Hubble (cropped).JPG"
    },
    "Falcon_Heavy_Fairing.jpg": {
        "bad_url": "https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/Tesla_Roadster_in_Falcon_Heavy_fairing.jpg",
        "wiki_title": "File:Payload Fairing with GSAT-6A being Integrated.jpg"
    },
    "Kepler_space_telescope.jpg": {
        "bad_url": "https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/Kepler-186f_39x27_CMYK-1.png",
        "wiki_title": "File:Kepler Space Telescope spacecraft model 2.png"
    }
}

def download_wiki_image(title):
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=imageinfo&iiprop=url&format=json"
    img_res = requests.get(api_url, headers=HEADERS)
    img_res.raise_for_status()
    img_data = img_res.json()
    pages = img_data.get("query", {}).get("pages", {})
    page = list(pages.values())[0]
    if "imageinfo" in page:
        url = page["imageinfo"][0]["url"]
        filename = title.replace("File:", "").replace(" ", "_")
        
        # download
        local_path = os.path.join(MEDIA_DIR, filename)
        if not os.path.exists(local_path):
            img_resp = requests.get(url, headers=HEADERS)
            img_resp.raise_for_status()
            with open(local_path, "wb") as f:
                f.write(img_resp.content)
                
        return url, filename
    return None, None

with open("data/space_olympiad_data.json", "r") as f:
    json_text = f.read()

for old_file, data in replacements.items():
    print(f"Fixing {old_file}...")
    bad_url = data["bad_url"]
    wiki_title = data["wiki_title"]
    
    url, filename = download_wiki_image(wiki_title)
    if url and filename:
        new_jsdelivr_url = f"https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/{filename}"
        json_text = json_text.replace(bad_url, new_jsdelivr_url)
        print(f"  -> Replaced {bad_url} with {new_jsdelivr_url}")

with open("data/space_olympiad_data.json", "w") as f:
    f.write(json_text)

print("Done replacing JSON links.")
