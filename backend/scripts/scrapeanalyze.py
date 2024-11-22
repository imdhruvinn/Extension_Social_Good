import requests
from bs4 import BeautifulSoup
from transformers import pipeline
from pymongo import MongoClient
import spacy
import sys
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)

# MongoDB connection
mongo_uri = "mongodb://localhost:27017/"
client = MongoClient(mongo_uri)
db = client['emotion_analysis_db']
collection = db['emotions']

# Load spaCy for tokenization
nlp = spacy.load("en_core_web_sm")

# Load summarization and emotion analysis models
try:
    summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
    emotion_analyzer = pipeline('text-classification', model='j-hartmann/emotion-english-distilroberta-base', top_k=None)
except Exception as e:
    logging.error(f"Error loading models: {e}")
    sys.exit(1)

# Function to scrape content from the URL
def scrape_page_content(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract metadata for keywords and description
        keywords = soup.find('meta', attrs={'name': 'keywords'})
        description = soup.find('meta', attrs={'name': 'description'})
        
        meta_keywords = keywords['content'] if keywords else ""
        meta_description = description['content'] if description else ""
        
        # Find main text content
        paragraphs = soup.find_all('p')
        content = ' '.join(paragraph.text for paragraph in paragraphs)

        return {
            "meta_keywords": meta_keywords,
            "meta_description": meta_description,
            "content": content
        }
    except Exception as e:
        logging.error(f"Error scraping URL: {e}")
        return {
            "meta_keywords": "",
            "meta_description": "",
            "content": ""
        }

# Function to generate hashtags from keywords
def generate_hashtags(keywords):
    return [f"#{word.strip()}" for word in keywords.split(",") if word.strip()]

# Function to summarize text
def summarize_text(text):
    try:
        summary = summarizer(text, max_length=150, min_length=40, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        logging.error(f"Error summarizing text: {e}")
        return "Summary not available"

# Function to tokenize text using spaCy
def tokenize_text(text):
    doc = nlp(text)
    return [sent.text for sent in doc.sents]

# Function to analyze emotions and store results in MongoDB
def analyze_and_store_emotions(url, text, hashtags, uid):
    combined_text = text + " " + " ".join(hashtags)
    sentences = tokenize_text(combined_text)

    for sentence in sentences:
        try:
            # Analyze emotions for each sentence
            emotions = emotion_analyzer(sentence)

            # Validate the format and extract percentages
            if isinstance(emotions, list) and isinstance(emotions[0], list):
                emotion_data = emotions[0]  # Extract list of emotions for the sentence
                emotion_percentages = {
                    emotion['label']: emotion['score'] * 100 for emotion in emotion_data
                }
            else:
                logging.warning(f"Unexpected emotion data format: {emotions}")
                emotion_percentages = {}

            # Append emotion data with URL to the document with the given UID
            if collection.find_one({"uid": uid}):
                collection.update_one(
                    {"uid": uid},
                    {"$push": {"emotions": {"text": sentence, "url": url, "percentages": emotion_percentages}}}
                )
            else:
                collection.insert_one({
                    "uid": uid,
                    "emotions": [{"text": sentence, "url": url, "percentages": emotion_percentages}]
                })

            logging.info(f"Saved to MongoDB for UID {uid}: {sentence} -> {emotion_percentages}")
        except Exception as e:
            logging.error(f"Error analyzing emotions or saving to MongoDB: {e}")

# Main function to process the URL
def process_url(url, uid):
    logging.info(f"Scraping content from URL: {url}")
    scraped_data = scrape_page_content(url)

    combined_text = f"{scraped_data['meta_description']} {scraped_data['meta_keywords']} {scraped_data['content']}"
    if not combined_text.strip():
        logging.warning("No content found to analyze.")
        return

    hashtags = generate_hashtags(scraped_data['meta_keywords'])
    logging.info(f"Hashtags: {hashtags}")

    summary = summarize_text(combined_text)
    logging.info(f"Summary: {summary}")

    logging.info("Analyzing emotions based on combined content and hashtags...")
    analyze_and_store_emotions(url, combined_text, hashtags, uid)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        logging.error("Usage: python scrapeanalyze.py <URL> <UID>")
        sys.exit(1)

    url = sys.argv[1]
    uid = sys.argv[2]
    process_url(url, uid)
