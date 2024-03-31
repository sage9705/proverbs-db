from selenium import webdriver
from selenium.webdriver.common.by import By
from langdetect import detect
from pymongo import MongoClient
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from webdriver_manager.firefox import GeckoDriverManager

# Initialize MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["proverbs_db"]
english_collection = db["english_proverbs"]
spanish_collection = db["spanish_proverbs"]
french_collection = db["french_proverbs"]

# Initialize Selenium WebDriver (using Firefox)
options = Options()
options.headless = True  # Set Firefox to run in headless mode
service = Service(GeckoDriverManager().install())
driver = webdriver.Firefox(service=service, options=options)

# Start from existing proverb sites
seed_urls = ["https://proverbicals.com/", "https://proverbhunter.com/"]

def find_and_scrape_new_urls():
    links = driver.find_elements(By.TAG_NAME, "a")
    potential_links = [link.get_attribute('href') for link in links if 'proverb' in link.text.lower()]
    for link in potential_links:
        if link not in seed_urls:  # Avoid scraping the same pages
            seed_urls.append(link)
            scrape_proverbs(link)

def scrape_proverbs(url):
    driver.get(url)
    proverb_elements = driver.find_elements(By.XPATH, "//p[contains(translate(., 'PROVERB', 'proverb'), 'proverb')]")
    for proverb_element in proverb_elements:
        proverb_text = proverb_element.text.strip()
        language = detect(proverb_text) if len(proverb_text) > 10 else 'en'  # Detect language (fallback to English)
        if language == 'en':
            english_collection.insert_one({"proverb": proverb_text})
            print(f"Success: English proverb scraped - {proverb_text}")
        elif language == 'es':
            spanish_collection.insert_one({"proverb": proverb_text})
            print(f"Success: Spanish proverb scraped - {proverb_text}")
        elif language == 'fr':
            french_collection.insert_one({"proverb": proverb_text})
            print(f"Success: French proverb scraped - {proverb_text}")
        else:
            print(f"Failure: Unknown language for proverb - {proverb_text}")


# Scrape from existing sites
for seed_url in seed_urls:
    scrape_proverbs(seed_url)

# Close the browser
driver.quit()
