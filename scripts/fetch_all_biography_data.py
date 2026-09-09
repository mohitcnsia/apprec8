import os
import re
import requests
from duckduckgo_search import DDGS
from youtubesearchpython import VideosSearch

def download_image(url, filename, out_dir):
    try:
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        r.raise_for_status()
        filepath = os.path.join(out_dir, filename)
        with open(filepath, "wb") as f:
            f.write(r.content)
        print(f"Downloaded {filename}")
        return True
    except Exception as e:
        print(f"Failed to download {filename} from {url}: {e}")
        return False

def search_ddg_image(query):
    try:
        results = DDGS().images(query, max_results=1)
        if results:
            return results[0]['image']
    except Exception as e:
        print(f"DDG error for {query}: {e}")
    return None

def search_youtube(query):
    try:
        videosSearch = VideosSearch(query, limit = 1)
        res = videosSearch.result()
        if res and res.get('result'):
            return res['result'][0]['id']
    except Exception as e:
        print(f"YT error for {query}: {e}")
    return None

out_dir = "/Users/mohitchilkoti/Documents/projects/apprec8/data/media_backup"
os.makedirs(out_dir, exist_ok=True)

personalities = [
    "Vikram Sarabhai", "Satish Dhawan", "U. R. Rao", "Rakesh Sharma",
    "Kalpana Chawla", "Sunita Williams", "K. Sivan", "S. Somanath",
    "Tessy Thomas", "Prashanth Balakrishnan Nair", "Ajit Krishnan",
    "Angad Pratap", "Shubhanshu Shukla"
]

bio_file = "/Users/mohitchilkoti/Documents/projects/apprec8/data/biographies.js"
with open(bio_file, "r") as f:
    content = f.read()

for p in personalities:
    print(f"Processing {p}...")
    safe_name = p.replace(" ", "_").replace(".", "")
    
    # 1. Fetch YouTube
    yt_id = search_youtube(f"{p} ISRO biography")
    if not yt_id: yt_id = "w6Y1H_v9g2M" # fallback
    
    # 2. Fetch Images
    childhood_url = search_ddg_image(f"{p} ISRO childhood or early life")
    lab_url = search_ddg_image(f"{p} ISRO scientist working or rocket")
    
    child_file = f"{safe_name}_childhood.jpg"
    lab_file = f"{safe_name}_lab.jpg"
    
    if childhood_url: download_image(childhood_url, child_file, out_dir)
    if lab_url: download_image(lab_url, lab_file, out_dir)
    
    # 3. Modify content block
    # We will find the content block for this person.
    # It looks like: name: "Vikram Sarabhai", ... content: `# Vikram Sarabhai... \n\n## A Curious Mind\n\n...`
    
    # Simple regex to replace the YouTube link
    # The existing youtube link is: [![YouTube Video](https://img.youtube.com/vi/<OLD_ID>/0.jpg)](https://www.youtube.com/watch?v=<OLD_ID>)
    
    # Find the block for this person
    pattern = rf'(name:\s*"{p}".*?content:\s*`.*?)(---\n\n\[!\[YouTube Video\].*?\n)?(`)'
    
    def replacer(match):
        base_content = match.group(1)
        
        # Inject childhood image before the first ## if not present
        if f"{safe_name}_childhood.jpg" not in base_content and childhood_url:
            base_content = re.sub(r'(## .*?\n)', rf'\1\n![{p} Childhood](https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/{child_file})\n\n', base_content, count=1)
            
        # Inject lab image before the second ## if not present
        if f"{safe_name}_lab.jpg" not in base_content and lab_url:
            base_content = re.sub(r'(## .*?\n.*?\n## .*?\n)', rf'\1\n![{p} at Work](https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/{lab_file})\n\n', base_content, count=1)
            
        new_yt = f"---\n\n[![YouTube Video](https://img.youtube.com/vi/{yt_id}/0.jpg)](https://www.youtube.com/watch?v={yt_id})\n"
        return base_content + new_yt + "`"
    
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open(bio_file, "w") as f:
    f.write(content)

print("Done updating biographies!")
