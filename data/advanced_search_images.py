import json
import os
import requests
import time
from urllib.parse import unquote, urlparse
import re

HEADERS = {
    'User-Agent': 'SpaceOlympiadApp/1.0 (mohitchilkoti+cnsia@gmail.com)'
}

MEDIA_DIR = "data/media_backup"
os.makedirs(MEDIA_DIR, exist_ok=True)

with open("data/space_olympiad_data.json", "r") as f:
    quiz_data = json.load(f)

processed_files = {}
report = [
    "| Question Text | Original Filename | New Filename | New Image Preview |",
    "|---------------|-------------------|--------------|-------------------|"
]

def clean_search_term(filename, question_text):
    name = os.path.splitext(filename)[0]
    name = name.replace("_", " ")
    name = re.sub(r'\d+$', '', name)
    name = name.replace(" crop", "").replace(" edit", "").replace(" model", "")
    
    if len(name) < 4:
        words = question_text.split()
        return " ".join(words[:5])
    
    return name

def search_wikipedia_image(query):
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=file:{query}&utf8=&format=json&srnamespace=6"
    try:
        res = requests.get(api_url, headers=HEADERS)
        res.raise_for_status()
        data = res.json()
        results = data.get("query", {}).get("search", [])
        
        # Filter for actual images, skip video/pdf
        valid_exts = ['.jpg', '.jpeg', '.png', '.svg', '.gif']
        
        for result in results:
            title = result["title"]
            ext = os.path.splitext(title)[1].lower()
            if ext in valid_exts:
                img_url_api = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=imageinfo&iiprop=url&format=json"
                img_res = requests.get(img_url_api, headers=HEADERS)
                img_res.raise_for_status()
                img_data = img_res.json()
                
                pages = img_data.get("query", {}).get("pages", {})
                page = list(pages.values())[0]
                if "imageinfo" in page:
                    return page["imageinfo"][0]["url"], title.replace("File:", "")
    except Exception as e:
        print(f"Error searching for {query}: {e}")
    return None, None

def process_url(old_url, question_text):
    if "upload.wikimedia.org" not in old_url:
        return old_url

    parsed_url = urlparse(old_url)
    filename = os.path.basename(parsed_url.path)
    filename = unquote(filename)
    
    if filename in processed_files:
        return processed_files[filename]
        
    print(f"Searching replacement for: {filename}")
    search_term = clean_search_term(filename, question_text)
    
    new_url, new_filename = search_wikipedia_image(search_term)
    
    if not new_url:
        fallback_query = " ".join(question_text.split()[:7])
        new_url, new_filename = search_wikipedia_image(fallback_query)
        
    if new_url and new_filename:
        new_filename = new_filename.replace(" ", "_")
        print(f"  -> Found new image: {new_filename}")
        
        local_path = os.path.join(MEDIA_DIR, new_filename)
        if not os.path.exists(local_path):
            try:
                img_resp = requests.get(new_url, headers=HEADERS, timeout=10) # 10s timeout
                img_resp.raise_for_status()
                with open(local_path, "wb") as img_file:
                    img_file.write(img_resp.content)
                print(f"  -> Downloaded to {local_path}")
            except Exception as e:
                print(f"  -> Failed to download {new_url}: {e}")
                processed_files[filename] = old_url
                return old_url
                
        new_jsdelivr_url = f"https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/{new_filename}"
        processed_files[filename] = new_jsdelivr_url
        
        q_text_clean = question_text.replace("\n", " ")[:50] + "..."
        img_tag = f"<img src='{new_url}' width='150'/>"
        report.append(f"| {q_text_clean} | `{filename}` | `{new_filename}` | {img_tag} |")
        
        time.sleep(0.5)
        return new_jsdelivr_url
    else:
        print(f"  -> No replacement found.")
        processed_files[filename] = old_url
        return old_url

def update_node(node, parent_question_text=""):
    q_text = parent_question_text
    if isinstance(node, dict):
        if "question" in node and isinstance(node["question"], str):
            q_text = node["question"]
            
        if "mediaUrl" in node and isinstance(node["mediaUrl"], str):
            node["mediaUrl"] = process_url(node["mediaUrl"], q_text)
            
        for k, v in node.items():
            if isinstance(v, (dict, list)):
                update_node(v, q_text)
                
    elif isinstance(node, list):
        for item in node:
            if isinstance(item, (dict, list)):
                update_node(item, q_text)

print("Starting advanced search...")
update_node(quiz_data)

with open("data/space_olympiad_data.json", "w") as f:
    json.dump(quiz_data, f, indent=2)

with open("data/image_replacements_report.md", "w") as f:
    f.write("\n".join(report))

print("Done updating JSON and generating report!")
