import requests

HEADERS = {
    'User-Agent': 'SpaceOlympiadApp/1.0 (mohitchilkoti+cnsia@gmail.com)'
}

queries = ["Payload fairing", "Falcon Heavy"]

for q in queries:
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=file:{q}&utf8=&format=json&srnamespace=6"
    res = requests.get(api_url, headers=HEADERS)
    data = res.json()
    results = data.get("query", {}).get("search", [])
    
    print(f"\n--- Results for '{q}' ---")
    for r in results[:5]:
        print(r["title"])
