import time
import random
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from langdetect import detect


# *** Helper Functions ***
def initialize_mongodb_connection():
    client = MongoClient("localhost", 27017)  # Adjust connection details if needed
    db = client["proverbs_database"]
    return db


def initialize_selenium_webdriver():
    options = Options()
    options.headless = True
    return webdriver.Chrome(options=options)


# ***  Search Functions ***
def search_for_proverb_websites(search_engine="https://www.google.com"):
    """Search for new websites, change search_engine if desired"""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    queries = [
        "english proverbs",
        "spanish sayings",
        "french proverbs",
        "german proverbs",
    ]  # Add more queries
    list_of_new_urls = []  # Initialize an empty list

    for query in queries:
        driver.get(search_engine + "/search?q=" + query)

        # Extract and filter results
        results = driver.find_elements(By.CSS_SELECTOR, "a[href^='http']")  # Use By from selenium.webdriver.common.by

        for result in results:
            href = result.get_attribute("href")

            # Basic filtering (you may want more sophisticated rules)
            if "proverb" in href and href not in list_of_new_urls:
                list_of_new_urls.append(href)

    driver.quit()
    return list_of_new_urls



# *** Crawling Functions ***
def check_if_visited(db, url):
    visited_collection = db["visited_urls"]
    return visited_collection.count_documents({"url": url}) > 0


def crawl_and_scrape_proverbs(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        # Find the elements containing proverbs (adjust selectors as needed)
        proverb_elements = soup.find_all("div", class_="proverb")

        proverbs = [element.text.strip() for element in proverb_elements]
        return proverbs
    except Exception as e:
        print(f"Error crawling and scraping {url}: {e}")
        return []


# *** Storage Functions ***
def store_proverbs(db, proverbs, language):
    collection_name = f"{language}_proverbs"
    collection = db[collection_name]
    for proverb in proverbs:
        collection.insert_one({"text": proverb})


def mark_url_as_visited(db, url):
    visited_collection = db["visited_urls"]
    visited_collection.insert_one({"url": url})


def extract_language_from_url(url):
    """Attempts to extract language from URL patterns and website content."""
    language = None

    # Basic pattern checks
    parts = url.split(".")
    if parts[0] in ("es", "fr", "en", "de"):
        language = {"es": "spanish", "fr": "french", "en": "english", "de": "german"}[parts[0]]
    elif len(parts) > 1:
        tld = parts[-1]
        if tld in ("es", "fr", "en", "de"):
            language = {"es": "spanish", "fr": "french", "en": "english", "de": "german"}[tld]

    # Fallback: Try detecting based on website content
    if language is None:
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()

            sample_text = response.text[:1000]
            language = detect(sample_text)
        except (requests.exceptions.RequestException, Exception):
            pass

    return language


# *** Main Loop ***
def main():
    db = initialize_mongodb_connection()

    while True:
        new_urls = search_for_proverb_websites()

        for url in new_urls:
            if not check_if_visited(db, url):
                try:
                    language = extract_language_from_url(url)  # Implement if possible
                    proverbs = crawl_and_scrape_proverbs(url)
                    store_proverbs(db, proverbs, language)
                    mark_url_as_visited(db, url)
                    print(f"Processed {url} - {len(proverbs)} proverbs stored for {language}.")
                except Exception as e:
                    print(f"Error processing {url}: {e}")

        time.sleep(60 * 60)  # Sleep for an hour


if __name__ == "__main__":
    main()
