import uuid
import logging
import threading
import asyncio
import aiohttp
from selenium import webdriver
from selenium.webdriver.common.by import By
from langdetect import detect
from pymongo import MongoClient, IndexModel
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from webdriver_manager.firefox import GeckoDriverManager
from fake_useragent import UserAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["proverbs_db"]
english_collection = db["english_proverbs"]
spanish_collection = db["spanish_proverbs"]
french_collection = db["french_proverbs"]

# Indexing on 'proverb' field for faster queries
english_collection.create_indexes([IndexModel([("proverb", pymongo.TEXT)])])
spanish_collection.create_indexes([IndexModel([("proverb", pymongo.TEXT)])])
french_collection.create_indexes([IndexModel([("proverb", pymongo.TEXT)])])

# Initialize Selenium WebDriver (using Firefox)
options = Options()
options.headless = True  # Set Firefox to run in headless mode
service = Service(GeckoDriverManager().install())
driver = webdriver.Firefox(service=service, options=options)

# Start from existing proverb sites
seed_urls = ["https://proverbicals.com/", "https://proverbhunter.com/"]

# Use a session object for caching
session_cache = {}


async def fetch_url(url, session):
    async with session.get(url) as response:
        return await response.text()


async def scrape_proverbs_async(url):
    async with aiohttp.ClientSession() as session:
        html_content = await fetch_url(url, session)
        proverb_elements = driver.find_elements(By.XPATH,
                                                "//p[contains(translate(., 'PROVERB', 'proverb'), 'proverb')]")
        for proverb_element in proverb_elements:
            proverb_text = proverb_element.text.strip()
            language = detect(proverb_text) if len(proverb_text) > 10 else 'en'  # Detect language (fallback to English)
            proverb_id = str(uuid.uuid4())  # Generate a UUID for each proverb
            if language == 'en':
                english_collection.insert_one({"_id": proverb_id, "proverb": proverb_text})
                logger.info(f"Success: English proverb scraped - {proverb_text}")
            elif language == 'es':
                spanish_collection.insert_one({"_id": proverb_id, "proverb": proverb_text})
                logger.info(f"Success: Spanish proverb scraped - {proverb_text}")
            elif language == 'fr':
                french_collection.insert_one({"_id": proverb_id, "proverb": proverb_text})
                logger.info(f"Success: French proverb scraped - {proverb_text}")
            else:
                logger.error(f"Failure: Unknown language for proverb - {proverb_text}")


async def scrape_urls_async(urls):
    tasks = []
    for url in urls:
        task = asyncio.create_task(scrape_proverbs_async(url))
        tasks.append(task)
    await asyncio.gather(*tasks)


def scrape_proverbs(url):
    try:
        if url in session_cache:
            html_content = session_cache[url]
        else:
            driver.get(url)
            html_content = driver.page_source
            session_cache[url] = html_content

        proverb_elements = driver.find_elements(By.XPATH,
                                                "//p[contains(translate(., 'PROVERB', 'proverb'), 'proverb')]")
        for proverb_element in proverb_elements:
            proverb_text = proverb_element.text.strip()
            language = detect(proverb_text) if len(proverb_text) > 10 else 'en'  # Detect language (fallback to English)
            proverb_id = str(uuid.uuid4())  # Generate a UUID for each proverb
            if language == 'en':
                english_collection.insert_one({"_id": proverb_id, "proverb": proverb_text})
                logger.info(f"Success: English proverb scraped - {proverb_text}")
            elif language == 'es':
                spanish_collection.insert_one({"_id": proverb_id, "proverb": proverb_text})
                logger.info(f"Success: Spanish proverb scraped - {proverb_text}")
            elif language == 'fr':
                french_collection.insert_one({"_id": proverb_id, "proverb": proverb_text})
                logger.info(f"Success: French proverb scraped - {proverb_text}")
            else:
                logger.error(f"Failure: Unknown language for proverb - {proverb_text}")
    except Exception as e:
        logger.error(f"An error occurred while scraping {url}: {e}")


def scrape_urls(urls):
    for url in urls:
        scrape_proverbs(url)


# Threading example
def scrape_urls_threaded(urls):
    threads = []
    for url in urls:
        thread = threading.Thread(target=scrape_proverbs, args=(url,))
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()


# Asynchronous scraping example
async def main():
    await scrape_urls_async(seed_urls)


# User-Agent Rotation example
def get_random_user_agent():
    ua = UserAgent()
    return ua.random


# Example usage of user-agent rotation
# options.add_argument(f'user-agent={get_random_user_agent()}')

# Configurability: Define configuration variables
# Example configuration
# mongodb_host = "localhost"
# mongodb_port = 27017
# mongodb_database = "proverbs_db"
# mongodb_username = "username"
# mongodb_password = "password"
# log_file_path = "logs/proverbs.log"

if __name__ == "__main__":
    # Example usage of threading
    # scrape_urls_threaded(seed_urls)

    # Example usage of asynchronous scraping
    asyncio.run(main())

    # Close the browser
    driver.quit()
