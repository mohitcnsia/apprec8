import json

with open("data/media_backup/url_mapping.json", "r") as f:
    mapping = json.load(f)

# Create a dictionary of old_url -> new_url for OK status only
url_dict = {}
for m in mapping:
    if m["status"] == "OK":
        new_url = f"https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/{m['local_file']}"
        url_dict[m["original_url"]] = new_url

with open("data/space_olympiad_data.json", "r") as f:
    quiz_data = json.load(f)

def update_urls(obj):
    if isinstance(obj, dict):
        if obj.get("mediaUrl") in url_dict:
            obj["mediaUrl"] = url_dict[obj["mediaUrl"]]
        for k, v in obj.items():
            update_urls(v)
    elif isinstance(obj, list):
        for item in obj:
            update_urls(item)

update_urls(quiz_data)

with open("data/space_olympiad_data.json", "w") as f:
    json.dump(quiz_data, f, indent=2)

print(f"Replaced {len(url_dict)} valid URLs in space_olympiad_data.json.")
