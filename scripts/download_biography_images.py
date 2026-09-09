import os
import requests

def get_main_image(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=1000"
    try:
        response = requests.get(url, headers={"User-Agent": "Apprec8Bot/1.0 (mohitcnsia@gmail.com)"}).json()
        pages = response.get("query", {}).get("pages", {})
        for page_id, page_data in pages.items():
            if "thumbnail" in page_data:
                return page_data["thumbnail"]["source"]
    except Exception as e:
        print(f"Error fetching image for {title}: {e}")
    return None

def download_image(url, filename, out_dir):
    try:
        r = requests.get(url, headers={"User-Agent": "Apprec8Bot/1.0 (mohitcnsia@gmail.com)"})
        r.raise_for_status()
        filepath = os.path.join(out_dir, filename)
        with open(filepath, "wb") as f:
            f.write(r.content)
        print(f"Downloaded {filename}")
        return True
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
        return False

def main():
    out_dir = "/Users/mohitchilkoti/Documents/projects/apprec8/data/media_backup"
    os.makedirs(out_dir, exist_ok=True)

    personalities = {
        "A. P. J. Abdul Kalam": "A._P._J._Abdul_Kalam.jpg",
        "Vikram Sarabhai": "Vikram_Sarabhai.jpg",
        "Satish Dhawan": "Satish_Dhawan.jpg",
        "U. R. Rao": "U._R._Rao.jpg",
        "Rakesh Sharma": "Rakesh_Sharma.jpg",
        "Kalpana Chawla": "Kalpana_Chawla.jpg",
        "Sunita Williams": "Sunita_Williams.jpg",
        "K. Sivan": "K._Sivan.jpg",
        "S. Somanath": "S_Somanath.jpg",
        "Tessy Thomas": "Tessy_Thomas.jpg",
        "Prashanth Balakrishnan Nair": "Prashanth_Balakrishnan_Nair.jpg",
        "Ajit Krishnan": "Ajit_Krishnan.jpg",
        "Angad Pratap": "Angad_Pratap.jpg",
        "Shubhanshu Shukla": "Shubhanshu_Shukla.jpg"
    }

    for name, filename in personalities.items():
        img_url = get_main_image(name)
        if img_url:
            print(f"Found image for {name}: {img_url}")
            download_image(img_url, filename, out_dir)
        else:
            print(f"No image found for {name}")

if __name__ == "__main__":
    main()
