from pymongo import MongoClient
from transformers import pipeline
import spacy
from datetime import datetime
import sys
import json

# MongoDB setup
mongo_uri = "mongodb://localhost:27017"
client = MongoClient(mongo_uri)
db = client['emotion_analysis_db']
collection = db['emotions']

# Load spaCy and emotion analysis model
nlp = spacy.load("en_core_web_sm")
emotion_analyzer = pipeline('text-classification', model='j-hartmann/emotion-english-distilroberta-base', top_k=None)

def tokenize_text(text):
    """Tokenize text using spaCy."""
    doc = nlp(text)
    return [sent.text.strip() for sent in doc.sents]

def analyze_and_save_emotions(uid, summary, hashtags):
    """Analyze emotions and save results to MongoDB."""
    if not uid or not summary:
        print("Error: UID or summary missing. Cannot proceed.")
        return

    combined_text = f"{summary} {' '.join(hashtags)}".strip()
    if not combined_text:
        print("Error: Combined text is empty. Skipping emotion analysis.")
        return

    print(f"Combined text: {combined_text}")
    sentences = tokenize_text(combined_text)
    emotion_data = []

    for sentence in sentences:
        try:
            emotions = emotion_analyzer(sentence)
            formatted_emotions = [
                {"label": emo['label'], "score": emo['score']}
                for emo in emotions if 'label' in emo and 'score' in emo
            ]
            if formatted_emotions:
                emotion_data.append({
                    "text": sentence,
                    "emotions": formatted_emotions,
                    "timestamp": datetime.utcnow()
                })
        except Exception as e:
            print(f"Error analyzing emotions for sentence: {sentence}. Error: {str(e)}")

    if not emotion_data:
        print("No emotion data found.")
        return

    try:
        collection.update_one(
            {"uid": uid},
            {
                "$setOnInsert": {"uid": uid},
                "$push": {"data": {"$each": emotion_data}}
            },
            upsert=True
        )
        print(f"Emotion data saved successfully for UID: {uid}")
    except Exception as e:
        print(f"Error saving to MongoDB: {e}")

# Main function for script arguments
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Error: Missing arguments. Expected UID and summary.")
        sys.exit(1)

    uid = sys.argv[1]
    summary = sys.argv[2]
    try:
        hashtags = json.loads(sys.argv[3]) if len(sys.argv) > 3 else []
    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}")
        hashtags = []

    analyze_and_save_emotions(uid, summary, hashtags)
